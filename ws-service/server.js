const WebSocket = require("ws");
const redis = require("redis");

// Redis Subscriber (listens to messages from API)
const sub = redis.createClient({ url: "redis://127.0.0.1:6379" });
sub.connect();

// WebSocket Server
const wss = new WebSocket.Server({ port: 8081 });

let clients = {}; 
// clients[eventId] = [ws, ws, ws...]

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (msg) => {
        try {
            let data = JSON.parse(msg);

            // The client must send: { eventId, userId }
            if (data.type === "join") {
                if (!clients[data.eventId]) {
                    clients[data.eventId] = [];
                }
                ws.eventId = data.eventId;
                ws.userId = data.userId;
                clients[data.eventId].push(ws);
                console.log("User joined room:", data.eventId);
            }

        } catch (err) {
            console.log("Invalid WS message", err);
        }
    });

    ws.on("close", () => {
        if (ws.eventId && clients[ws.eventId]) {
            clients[ws.eventId] = clients[ws.eventId].filter(c => c !== ws);
        }
    });
});

// Listen to Redis messages from API
sub.subscribe("event_messages", (msg) => {

    let data = JSON.parse(msg);
    let eventId = data.eventId;

    if (clients[eventId]) {
        for (let client of clients[eventId]) {
            client.send(JSON.stringify(data));
        }
    }
});

console.log("WS Service running on ws://localhost:8081");
