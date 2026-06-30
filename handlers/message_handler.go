package handlers

import (
	"log"
	"strconv"
	"sync"
	"time"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var (
	Clients      = make(map[uint]*websocket.Conn)
	ClientsMutex sync.RWMutex
)

// =======================================================
// WEBSOCKET CHAT
// =======================================================

func Chat(c *websocket.Conn) {

	userID64, err := strconv.ParseUint(
		c.Params("userId"),
		10,
		64,
	)

	if err != nil {
		log.Println(err)
		return
	}

	userID := uint(userID64)

	conversationID64, err := strconv.ParseUint(
		c.Params("conversationId"),
		10,
		64,
	)

	if err != nil {
		log.Println(err)
		return
	}

	conversationID := uint(conversationID64)

	ClientsMutex.Lock()

	if oldConn, ok := Clients[userID]; ok {
		oldConn.Close()
	}

	Clients[userID] = c

	ClientsMutex.Unlock()

	defer func() {

		ClientsMutex.Lock()
		delete(Clients, userID)
		ClientsMutex.Unlock()

		c.Close()

	}()

	for {

		var msg struct {
			ReceiverID uint   `json:"receiver_id"`
			Message    string `json:"message"`
		}
		if err := c.ReadJSON(&msg); err != nil {
			log.Println(err)
			break
		}

		senderID := userID
		receiverID := msg.ReceiverID
		convID := conversationID

		// Save message

		message := models.Message{
			ConversationID: convID,
			SenderID:       senderID,
			ReceiverID:     receiverID,
			Content:        msg.Message,
			IsRead:         false,
		}

		if err := config.DB.Create(&message).Error; err != nil {
			log.Println(err)
			continue
		}

		// Update conversation preview

		if err := config.DB.
			Model(&models.Conversation{}).
			Where("id = ?", convID).
			Updates(map[string]interface{}{
				"last_message":    msg.Message,
				"last_message_at": time.Now(),
			}).Error; err != nil {

			log.Println(err)

		}

		// Send instantly if receiver is online
		payload := fiber.Map{
			"conversation_id": convID,
			"sender_id":       senderID,
			"receiver_id":     receiverID,
			"message":         msg.Message,
		}

		ClientsMutex.RLock()

		receiver, receiverOnline := Clients[receiverID]
		sender, senderOnline := Clients[senderID]

		ClientsMutex.RUnlock()

		if receiverOnline {
			if err := receiver.WriteJSON(payload); err != nil {
				log.Println(err)
			}
		}

		if senderOnline {
			if err := sender.WriteJSON(payload); err != nil {
				log.Println(err)
			}
		}
	}
}

// =======================================================
// CREATE CONVERSATION
// =======================================================

func CreateConversation(c *fiber.Ctx) error {

	clientID, _ := c.Locals("userID").(uint)

	var body struct {
		ProjectID    uint `json:"project_id"`
		FreelancerID uint `json:"freelancer_id"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	var project models.Project
	if err := config.DB.First(&project, body.ProjectID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	// Only the project owner can start the conversation
	if project.ClientID != clientID {
		return c.Status(403).JSON(fiber.Map{
			"error": "you do not own this project",
		})
	}

	// Check that the freelancer actually submitted a proposal
	var proposal models.Proposal

	if err := config.DB.
		Where(
			"project_id = ? AND freelancer_id = ?",
			body.ProjectID,
			body.FreelancerID,
		).
		First(&proposal).Error; err != nil {

		return c.Status(403).JSON(fiber.Map{
			"error": "this freelancer has not bid on the project",
		})
	}

	// Check if conversation already exists
	var conversation models.Conversation

	err := config.DB.
		Where(
			"project_id = ? AND client_id = ? AND freelancer_id = ?",
			body.ProjectID,
			clientID,
			body.FreelancerID,
		).
		First(&conversation).Error

	if err == nil {
		return c.JSON(conversation)
	}

	// Create a new conversation
	conversation = models.Conversation{
		ProjectID:     body.ProjectID,
		ClientID:      clientID,
		FreelancerID:  body.FreelancerID,
		LastMessage:   "",
		LastMessageAt: time.Now(),
	}

	if err := config.DB.Create(&conversation).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create conversation",
		})
	}

	return c.Status(201).JSON(conversation)
}

// =======================================================
// GET ALL CONVERSATIONS
// =======================================================

func GetConversations(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	var conversations []models.Conversation

	if err := config.DB.
		Preload("Project").
		Preload("Freelancer").
		Preload("Client").
		Where(
			"client_id = ? OR freelancer_id = ?",
			userID,
			userID,
		).
		Order("last_message_at DESC").
		Find(&conversations).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch conversations",
		})
	}

	return c.JSON(conversations)
}

// =======================================================
// GET ALL MESSAGES OF A CONVERSATION
// =======================================================

func GetMessages(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	conversationID, err := strconv.Atoi(c.Params("conversationId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid conversation id",
		})
	}

	// Verify the user belongs to this conversation
	var conversation models.Conversation

	if err := config.DB.
		First(&conversation, conversationID).Error; err != nil {

		return c.Status(404).JSON(fiber.Map{
			"error": "conversation not found",
		})
	}

	if conversation.ClientID != userID &&
		conversation.FreelancerID != userID {

		return c.Status(403).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	var messages []models.Message

	if err := config.DB.
		Where("conversation_id = ?", conversationID).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch messages",
		})
	}

	return c.JSON(messages)
}

// =======================================================
// MARK CONVERSATION AS READ
// =======================================================

func MarkConversationRead(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	conversationID, err := strconv.Atoi(c.Params("conversationId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid conversation id",
		})
	}

	// Verify the user belongs to this conversation
	var conversation models.Conversation

	if err := config.DB.
		First(&conversation, conversationID).Error; err != nil {

		return c.Status(404).JSON(fiber.Map{
			"error": "conversation not found",
		})
	}

	if conversation.ClientID != userID &&
		conversation.FreelancerID != userID {

		return c.Status(403).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	if err := config.DB.
		Model(&models.Message{}).
		Where(
			"conversation_id = ? AND receiver_id = ?",
			conversationID,
			userID,
		).
		Update("is_read", true).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to mark messages as read",
		})
	}

	return c.JSON(fiber.Map{
		"message": "conversation marked as read",
	})
}
