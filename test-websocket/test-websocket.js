const WebSocket = require('ws');

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:3000');

// Listen for messages from the server
ws.on('message', (message) => {
    console.log('Received:', message);
});

// Send a message to the server
ws.on('open', () => {
    const message = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDMwNDU1MTUsImV4cCI6MTc0MzA0OTExNX0.wOM6gDasKQI23nuYMSWKCNEMopA3TZqxlv4mS4wkuEU",
        phrase: "how are you",
        userId: 10,
        roomId: 29
    }
    ws.send(JSON.stringify(message));
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
});

