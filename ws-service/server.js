const WebSocket = require("ws");
const redis = require("redis");

// Redis Clients
const sub = redis.createClient({ url: "redis://127.0.0.1:6379" });
const cache = redis.createClient({ url: "redis://127.0.0.1:6379" });

sub.connect();
cache.connect();

// WebSocket Server
const wss = new WebSocket.Server({ port: 8081 });

let clients = {}; 
// clients[eventId] = [ws, ws, ws...]

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (msg) => {
        try {
            let data = JSON.parse(msg);

            //join room
            if (data.type === "join") {

                let eventId = data.eventId;

                // Check if room exists in Redis
                let roomActive = await cache.get(`room:${eventId}`);

                if (!roomActive) {
                    return ws.send(JSON.stringify({
                        success: false,
                        message: "Room not created yet"
                    }));
                }

                if (!clients[eventId]) {
                    clients[eventId] = [];
                }

                ws.eventId = eventId;
                ws.userId = data.userId;

                clients[eventId].push(ws);

                console.log("User joined room:", eventId);

                ws.send(JSON.stringify({
                    success: true,
                    message: `Joined room ${eventId}`
                }));
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

//redis broadcast
sub.subscribe("event_messages", (msg) => {
    let data = JSON.parse(msg);
    let eventId = data.eventId;

    if (clients[eventId]) {
        clients[eventId].forEach(client => {
            client.send(JSON.stringify(data));
        });
    }
});

console.log("WS Service running on ws://localhost:8081");
