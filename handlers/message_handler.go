
package handlers

import (
	"log"
	"strconv"
	"time"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var Clients = make(map[string]*websocket.Conn)

func Chat(c *websocket.Conn) {

	userID := c.Params("userId")

	Clients[userID] = c

	defer func() {
		delete(Clients, userID)
		c.Close()
	}()

	for {

		var msg struct {
			ReceiverID string `json:"receiver_id"`
			Message    string `json:"message"`
		}

		if err := c.ReadJSON(&msg); err != nil {
			log.Println(err)
			break
		}

		senderIDUint, _ := strconv.ParseUint(userID, 10, 64)
		receiverIDUint, _ := strconv.ParseUint(msg.ReceiverID, 10, 64)

		// ---------------------------------------------------
		// FIND OR CREATE CONVERSATION
		// ---------------------------------------------------

		var conversation models.Conversation

		err := config.DB.
			Where(
				"(user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
				uint(senderIDUint),
				uint(receiverIDUint),
				uint(receiverIDUint),
				uint(senderIDUint),
			).
			First(&conversation).Error

		if err != nil {

			conversation = models.Conversation{
				User1ID: uint(senderIDUint),
				User2ID: uint(receiverIDUint),

				LastMessage:   msg.Message,
				LastMessageAt: time.Now(),
			}

			if err := config.DB.Create(&conversation).Error; err != nil {
				log.Println("failed to create conversation:", err)
				continue
			}
		}

		// ---------------------------------------------------
		// SAVE MESSAGE
		// ---------------------------------------------------

		message := models.Message{
			ConversationID: conversation.ID,

			SenderID:   uint(senderIDUint),
			ReceiverID: uint(receiverIDUint),

			Content: msg.Message,
			IsRead: false,
		}

		if err := config.DB.Create(&message).Error; err != nil {
			log.Println("failed to save message:", err)
		}

		// ---------------------------------------------------
		// UPDATE CONVERSATION
		// ---------------------------------------------------

		config.DB.Model(&conversation).Updates(
			map[string]interface{}{
				"last_message":    msg.Message,
				"last_message_at": time.Now(),
			},
		)

		// ---------------------------------------------------
		// SEND TO RECEIVER IF ONLINE
		// ---------------------------------------------------

		if receiver, ok := Clients[msg.ReceiverID]; ok {

			receiver.WriteJSON(fiber.Map{
				"conversation_id": conversation.ID,
				"sender_id":       userID,
				"receiver_id":     msg.ReceiverID,
				"message":         msg.Message,
			})
		}
	}
}

// ---------------------------------------------------
// GET ALL CONVERSATIONS
// ---------------------------------------------------

func GetConversations(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	var conversations []models.Conversation

	if err := config.DB.
		Where(
			"user1_id = ? OR user2_id = ?",
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

// ---------------------------------------------------
// GET ALL MESSAGES OF A CONVERSATION
// ---------------------------------------------------

func GetMessages(c *fiber.Ctx) error {

	conversationID := c.Params("conversationId")

	var messages []models.Message

	if err := config.DB.
		Where(
			"conversation_id = ?",
			conversationID,
		).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch messages",
		})
	}

	return c.JSON(messages)
}

// ---------------------------------------------------
// MARK AS READ
// ---------------------------------------------------

func MarkConversationRead(c *fiber.Ctx) error {

	conversationID := c.Params("conversationId")

	if err := config.DB.
		Model(&models.Message{}).
		Where(
			"conversation_id = ?",
			conversationID,
		).
		Update(
			"is_read",
			true,
		).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update messages",
		})
	}

	return c.JSON(fiber.Map{
		"message": "conversation marked as read",
	})
}