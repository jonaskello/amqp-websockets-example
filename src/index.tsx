// import AMQPChannel from "./js/amqp-channel";
import React from "react";
import ReactDOM from "react-dom";
// import AMQPClient from "./js/amqp-websocket-client";

// This does not work...
// import AMQPClient from "@cloudamqp/amqp-client";
import { AMQPWebSocketClient, AMQPChannel } from "@jonaskello-forks/amqp-client";

const url = `ws://localhost:15670`;
const amqp = new AMQPWebSocketClient(url, "/", "guest", "guest");

ReactDOM.render(<View />, document.getElementById("root")!);

function View(): JSX.Element {
  const [channel, setChannel] = React.useState<AMQPChannel>();
  const [message, setMessage] = React.useState("");
  const [recvBuffer, setRecvBuffer] = React.useState("");

  React.useEffect(() => {
    const boot = async () => {
      try {
        const conn = await amqp.connect();
        const ch = await conn.channel();
        const q = await ch.queue("");
        await q.bind("amq.fanout");
        await q.subscribe({ noAck: false }, (msg) => {
          setRecvBuffer((prev) => prev + msg.bodyToString() + "\n");
          msg.ack();
        });
        setChannel(ch);
      } catch (err) {
        console.error("Error", err, "reconnecting in 1s");
        setChannel(undefined);
        // setTimeout(boot, 1000);
      }
    };
    console.log("running boot");
    boot();
  }, []);

  if (channel === undefined) {
    return <div>Channel not connected yet...</div>;
  }

  async function publishMessage(ch: AMQPChannel, message: string) {
    try {
      await ch.basicPublish("amq.fanout", "", message, { contentType: "text/plain" });
    } catch (err) {
      console.error("Error", err, "reconnecting in 1s");
      setChannel(undefined);
      //setTimeout(start, 1000);
    }
    setMessage("");
  }

  return (
    <div>
      <textarea id="textarea" rows={10} defaultValue={recvBuffer} />
      <br />
      <input id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => publishMessage(channel, message)}>Send</button>
    </div>
  );
}
