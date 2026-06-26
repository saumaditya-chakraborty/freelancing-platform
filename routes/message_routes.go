package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func MessageRoutes(app *fiber.App) {

	// -----------------------------
	// WebSocket
	// -----------------------------

	app.Get(
		"/ws/:conversationId/:userId",
		websocket.New(handlers.Chat),
	)

	// -----------------------------
	// Conversations
	// -----------------------------

	app.Post(
		"/conversations",
		middleware.Protected(),
		middleware.RequireRole("client"),
		handlers.CreateConversation,
	)

	app.Get(
		"/conversations",
		middleware.Protected(),
		handlers.GetConversations,
	)

	// -----------------------------
	// Messages
	// -----------------------------

	app.Get(
		"/messages/:conversationId",
		middleware.Protected(),
		handlers.GetMessages,
	)

	app.Put(
		"/messages/read/:conversationId",
		middleware.Protected(),
		handlers.MarkConversationRead,
	)
}