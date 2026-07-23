package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func RequireRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		userRole := c.Locals("role")

		fmt.Println("Required:", role)
		fmt.Println("Actual:", userRole)

		if userRole != role {
			return c.Status(403).JSON(fiber.Map{
				"error": "access denied",
			})
		}

		return c.Next()
	}
}
