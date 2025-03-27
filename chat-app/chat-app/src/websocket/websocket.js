// websocket.js
let socket;

export const connectWebSocket = (url) => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);

    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => console.log("Message received:", event.data);
    socket.onclose = () => console.log("WebSocket disconnected");
    socket.onerror = (error) => console.error("WebSocket error:", error);
  }
  return socket;
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    console.log("Message sent:", message);
  } else {
    console.error("WebSocket is not open");
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    console.log("WebSocket closed");
  }
};