const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow all origins

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get("/", (req, res) => res.send("WebSocket Server is running!"));

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
        console.log("Received:", message);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.listen(8080, () => console.log("Server running on http://localhost:8080"));
