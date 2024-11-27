"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8000 });
let senderSocket = null;
let receiverSocket = null;
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        if (message.type === "sender") {
            console.log("sender set");
            senderSocket = ws;
        }
        else if (message.type === "receiver") {
            console.log("receiver set");
            receiverSocket = ws;
        }
        else if (message.type === "create-offer") {
            if (ws !== senderSocket)
                return;
            console.log("created the offer");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "create-offer", sdp: message.sdp }));
        }
        else if (message.type === "create-answer") {
            if (ws !== receiverSocket)
                return;
            console.log("created the answer");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "create-answer", sdp: message.sdp }));
        }
        else if (message.type === "iceCandidate") {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "iceCandidate", candidate: message.candidate }));
            }
            else {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "iceCandidate", candidate: message.candidate }));
            }
        }
    });
});
