import { useEffect } from "react";

const Receiver = () => {
  useEffect(() => {
    const socket = new WebSocket("http://localhost:8000");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };
  }, []);

  return <div>receiver</div>;
};

export default Receiver;
