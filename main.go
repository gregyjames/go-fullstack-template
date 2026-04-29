package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()

	// Add global middleware
	app.Use(logger.New())
	app.Use(compress.New())

	// Serve the static files from the frontend dist folder
	app.Static("/", "./frontend/dist")

	// API route group with basic auth
	api := app.Group("/api", basicauth.New(basicauth.Config{
		Users: map[string]string{
			"admin": "password",
		},
	}))

	// API route example
	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "pong"})
	})

	// Fallback to index.html for SPA routing
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./frontend/dist/index.html")
	})

	log.Fatal(app.Listen(":3000"))
}
