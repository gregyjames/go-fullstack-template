package main

import (
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/gorm"
)

// User model for GORM
type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex" json:"username"`
	Email    string `json:"email"`
}

func main() {
	// Setup database path
	// Use /data/app.db if the directory exists (Docker volume), otherwise use local app.db
	dbPath := "app.db"
	if _, err := os.Stat("/data"); !os.IsNotExist(err) {
		dbPath = "/data/app.db"
		log.Println("Using persistent database at", dbPath)
	} else {
		log.Println("Using local database at", dbPath)
	}

	// Initialize GORM with pure-Go SQLite driver
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	// Auto-migrate the schema
	db.AutoMigrate(&User{})

	// Initialize Fiber app
	app := fiber.New()

	// Add global middleware
	app.Use(logger.New())
	app.Use(compress.New())

	// Serve the static files from the dist folder
	app.Static("/", "./dist")

	// API route group with basic auth
	api := app.Group("/api", basicauth.New(basicauth.Config{
		Users: map[string]string{
			"admin": "password",
		},
	}))

	// API route example: Ping
	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "pong",
			"db_type": "GORM + SQLite",
		})
	})

	// API route: List Users
	api.Get("/users", func(c *fiber.Ctx) error {
		var users []User
		db.Find(&users)
		return c.JSON(users)
	})

	// API route: Create User
	api.Post("/users", func(c *fiber.Ctx) error {
		user := new(User)
		if err := c.BodyParser(user); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Cannot parse JSON"})
		}
		
		if err := db.Create(&user).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Could not create user"})
		}
		
		return c.Status(201).JSON(user)
	})

	// Fallback to index.html for SPA routing
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./dist/index.html")
	})

	log.Fatal(app.Listen(":3000"))
}
