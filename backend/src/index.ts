import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", (ws) => {
  ws.on("message", (data: any) => {
    const message = JSON.parse(data);
    if (message.type === "sender") {
      senderSocket = ws;
    } else if (message.type === "receiver") {
      receiverSocket = ws;
    } else if (message.type === "create-offer") {
      if (ws !== senderSocket) return;
      receiverSocket?.send(
        JSON.stringify(
          JSON.stringify({ type: "createOffer", sdp: message.sdp })
        )
      );
    } else if (message.type === "create-answer") {
      if (ws !== receiverSocket) return;
      senderSocket?.send(
        JSON.stringify(
          JSON.stringify({ type: "createAnswer", sdp: message.sdp })
        )
      );
    } else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      } else {
        senderSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      }
    }
  });
});
