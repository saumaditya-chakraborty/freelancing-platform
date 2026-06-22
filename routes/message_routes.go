package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func MessageRoutes(app *fiber.App) {

	// --------------------------------
	// WEBSOCKET CHAT
	// --------------------------------

	app.Get(
		"/ws/:userId",
		websocket.New(handlers.Chat),
	)

	// --------------------------------
	// CONVERSATIONS
	// --------------------------------

	app.Get(
		"/conversations",
		middleware.Protected(),
		handlers.GetConversations,
	)

	// --------------------------------
	// CHAT HISTORY
	// --------------------------------

	app.Get(
		"/messages/:conversationId",
		middleware.Protected(),
		handlers.GetMessages,
	)

	// --------------------------------
	// MARK AS READ
	// --------------------------------

	app.Put(
		"/messages/read/:conversationId",
		middleware.Protected(),
		handlers.MarkConversationRead,
	)
}