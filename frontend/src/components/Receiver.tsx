import { useEffect, useRef } from "react";

const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "receiver",
        })
      );
    };
    startReceiving(socket);
  }, []);

  function startReceiving(socket: WebSocket) {
    const pc = new RTCPeerConnection();
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
        videoRef.current.play();
      }
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "create-offer") {
        pc.setRemoteDescription(message.sdp).then(() => {
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            socket.send(
              JSON.stringify({
                type: "create-answer",
                sdp: answer,
              })
            );
          });
        });
      } else if (message.type === "iceCandidate") {
        pc.addIceCandidate(message.candidate);
      }
    };
  }

  return (
    <div>
      <video
        style={{
          width: "300px",
          height: "300px",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ref={videoRef}
      />
    </div>
  );
};

export default Receiver;
