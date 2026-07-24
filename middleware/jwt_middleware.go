package middleware

import (
	"fmt"
	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)
func Protected() fiber.Handler {

	return func(c *fiber.Ctx) error {

		authHeader := c.Get("Authorization")

		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing token",
			})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (interface{}, error) {
				if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
					return nil, fmt.Errorf("unexpected signing method")
				}
				return utils.SecretKey, nil
			},
		)

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token claims",
			})
		}

		id, ok := claims["id"].(float64)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid token claims",
			})
		}

		// ---------------------------------
		// Fetch latest user information
		// ---------------------------------

		var user models.User

		if err := config.DB.First(&user, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User not found",
			})
		}

		// ---------------------------------
		// Banned users cannot access APIs
		// ---------------------------------

		if user.IsBanned {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Your account has been banned.",
			})
		}

		// ---------------------------------
		// Blocked users cannot use the app
		// ---------------------------------

		if user.IsBlocked {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Your account has been blocked by the administrator.",
			})
		}

		// ---------------------------------
		// Store latest values
		// ---------------------------------

		c.Locals("userID", user.ID)
		c.Locals("email", user.Email)
		c.Locals("role", user.Role)

		return c.Next()
	}
}