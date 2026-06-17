package handlers

import (
	"log"
	"strconv"
	"github.com/gofiber/websocket/v2"
	"freelancing-platform/config"
	"freelancing-platform/models"
	"github.com/gofiber/fiber/v2"
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

		message := models.Message{
			SenderID:   uint(senderIDUint),
			ReceiverID: uint(receiverIDUint),
			Content:    msg.Message,
		}

		if err := config.DB.Create(&message).Error; err != nil {
			log.Println("failed to save message:", err)
		}

		if receiver, ok := Clients[msg.ReceiverID]; ok {
			receiver.WriteJSON(fiber.Map{
				"sender_id":   userID,
				"receiver_id": msg.ReceiverID,
				"message":     msg.Message,
			})
		}
	}
}