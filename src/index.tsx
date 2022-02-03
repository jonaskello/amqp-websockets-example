import React from "react";
import ReactDOM from "react-dom";
import { AMQPWebSocketClient, AMQPChannel } from "@cloudamqp/amqp-client";

const url = `ws://localhost:15670`;
const amqp = new AMQPWebSocketClient(url, "/", "guest", "guest");

ReactDOM.render(<View />, document.getElementById("root")!);

function View(): JSX.Element {
  const [channel, setChannel] = React.useState<AMQPChannel>();
  const [message, setMessage] = React.useState("");
  const [recvBuffer, setRecvBuffer] = React.useState("");

  React.useEffect(() => {
    const connect = async () => {
      if (channel?.connection.closed === false) {
        console.log("Already connected");
        return;
      }
      try {
        console.log("Connecting...");
        const conn = await amqp.connect();
        const ch = await conn.channel();
        const q = await ch.queue("");
        await q.bind("amq.fanout");
        await q.subscribe({ noAck: false }, (msg) => {
          console.log("Received message");
          setRecvBuffer((prev) => prev + msg.bodyToString() + "\n");
          msg.ack();
        });
        setChannel(ch);
        console.log("Connected!");
      } catch (err) {
        console.error("connect Error", err, "reconnecting in 1s");
        setChannel(undefined);
        setTimeout(connect, 1000);
      }
    };
    console.log("Calling connect");
    connect();
  }, [channel?.connection.closed]);

  if (channel === undefined) {
    return <div>Channel not connected yet...</div>;
  }

  async function publishMessage(ch: AMQPChannel, message: string) {
    console.log("Calling publishMessage");
    try {
      await ch.basicPublish("amq.fanout", "", message, { contentType: "text/plain" });
    } catch (err) {
      console.error("publishMessage Error", err, "reconnecting in 1s");
      setChannel(undefined);
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
