package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"

	"github.com/joho/godotenv"
	"github.com/sanjay/food-donate/router"
)

func main() {
	env := os.Getenv("GO_ENV")
	if "" == env {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	port := os.Getenv("PORT")
	fmt.Println("MongoDB API")
	fmt.Println("Server is getting started..")
	log.Print("Server starting at localhost:" + port)
	r := cors.Default().Handler(router.Router())
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}
