import AMQPChannel from "./js/amqp-channel";
import React from "react";
import ReactDOM from "react-dom";
import AMQPClient from "./js/amqp-websocket-client";

const url = `ws://localhost:15670`;
const amqp = new AMQPClient(url, "/", "guest", "guest");

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
        // attachPublish(ch);
        const q = await ch.queue("");
        await q.bind("amq.fanout");
        console.log("connected...");
        const consumer = await q.subscribe({ noAck: false }, (msg) => {
          console.log("Received message", msg);
          //textarea.value += msg.bodyToString() + "\n";
          setRecvBuffer(recvBuffer + msg.bodyToString() + "\n");
          msg.ack();
        });
        setChannel(ch);
      } catch (err) {
        console.error("Error", err, "reconnecting in 1s");
        // disablePublish();
        setChannel(undefined);
        // setTimeout(start, 1000);
      }
    };
    console.log("running boot");
    boot();
  }, []);

  if (channel === undefined) {
    return <div>Channel not connected yet...</div>;
  }

  return (
    <div>
      <textarea id="textarea" rows={10} defaultValue={recvBuffer} />
      <br />
      <input id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => doPublish(channel, message)}>Send</button>
    </div>
  );
}

// async function start(): Promise<AMQPChannel | undefined> {
//   try {
//     const conn = await amqp.connect();
//     const ch = await conn.channel();
//     // attachPublish(ch);
//     const q = await ch.queue("");
//     await q.bind("amq.fanout");
//     console.log("connected...");
//     const consumer = await q.subscribe({ noAck: false }, (msg) => {
//       console.log("Received message", msg);
//       //   textarea.value += msg.bodyToString() + "\n";
//       msg.ack();
//     });
//     return ch;
//   } catch (err) {
//     console.error("Error", err, "reconnecting in 1s");
//     // disablePublish();
//     // setTimeout(start, 1000);
//   }
// }

async function doPublish(ch: AMQPChannel, message: string) {
  try {
    //  async basicPublish(exchange: string, routingKey: string, data: string|Uint8Array|ArrayBuffer|Buffer|null, properties: AMQPProperties = {}, mandatory = false, immediate = false): Promise<number> {
    await ch.basicPublish("amqp.fanout", "", message, {
      contentType: "text/plain",
    });
  } catch (err) {
    console.error("Error", err, "reconnecting in 1s");
    // disablePublish();
    //setTimeout(start, 1000);
  }
  // input.value = "";
}

// function disablePublish() {
//   document.forms[0].onsubmit = (e) => {
//     alert("Disconnected, waiting to be reconnected");
//   };
// }
