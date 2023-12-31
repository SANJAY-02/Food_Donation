package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"github.com/go-redis/redis"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

type ChatMessage struct {
	Username string `json:"username"`
	Text     string `json:"text"`
}

var rdb *redis.Client

var clients = make(map[*websocket.Conn]bool)
var broadcaster = make(chan ChatMessage)
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	clients[ws] = true
	if rdb.Exists("chat_messages").Val() != 0 {
		sendPreviousMessages(ws)
	}
	for {
		var msg ChatMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			delete(clients, ws)
			break
		}
		broadcaster <- msg
	}
}
func sendPreviousMessages(ws *websocket.Conn) {
	chatMessages, err := rdb.LRange("chat_messages", 0, -1).Result()
	if err != nil {
		panic(err)
	}
	for _, chatMessage := range chatMessages {
		var msg ChatMessage
		json.Unmarshal([]byte(chatMessage), &msg)
		messageClient(ws, msg)
	}
}
func unsafeError(err error) bool {
	return !websocket.IsCloseError(err, websocket.CloseGoingAway) && err != io.EOF
}
func handleMessages() {
	for {
		msg := <-broadcaster
		storeInRedis(msg)
		messageClients(msg)
	}
}
func storeInRedis(msg ChatMessage) {
	json, err := json.Marshal(msg)
	if err != nil {
		panic(err)
	}
	if err := rdb.RPush("chat_messages", json).Err(); err != nil {
		panic(err)
	}
}
func messageClients(msg ChatMessage) {
	for client := range clients {
		messageClient(client, msg)
	}
}
func messageClient(client *websocket.Conn, msg ChatMessage) {
	err := client.WriteJSON(msg)
	if err != nil && unsafeError(err) {
		log.Printf("error: %v", err)
		client.Close()
		delete(clients, client)
	}
}
func main() {
	env := os.Getenv("GO_ENV")
	if "" == env {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	port := os.Getenv("PORT")
	redisURL := os.Getenv("REDIS_URL")
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		panic(err)
	}
	rdb = redis.NewClient(opt)
	http.Handle("/", http.FileServer(http.Dir("./chat")))
	http.HandleFunc("/websocket", handleConnections)
	go handleMessages()
	log.Print("Server starting at localhost:" + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
