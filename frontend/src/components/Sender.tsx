import { useEffect, useState } from "react";

const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("http://localhost:8000/");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
    setSocket(socket);
  }, []);

  const startSendingVideo = async () => {
    if (!socket) return;

    const pc = new RTCPeerConnection();
    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({ type: "create-offer", sdp: pc.localDescription })
      );
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
        );
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "create-answer") {
        pc.setRemoteDescription(data.sdp);
      } else if (data.type === "iceCandidate") {
        pc.addIceCandidate(data.candidate);
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    pc.addTrack(stream.getTracks()[0]);
  };

  return (
    <div>
      Sender
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  );
};

export default Sender;
