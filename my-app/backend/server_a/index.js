const { Kafka } = require("kafkajs");
const WebSocket = require("ws");

if (process.env.NODE_ENV === "dev") {
  console.log("\x1b[32m Hello from server A! I'm in dev mode! \x1b[32m");
}

const GROUPID_RAW = "raw-group";
const GROUPID_AGG = "aggregated-group";

const TOPIC_RAW = "raw-emote-data";
const TOPIC_AGG = "aggregated-emote-data";

// create clients set
const clients = new Set();

// create Kafka instance
const kafka = new Kafka({
  clientId: "server-a",
  brokers: [process.env.KAFKA_BROKER || "localhost:9094"], // 9092 for docker internal, 9094 for external browser
});

// --add cors somehow here--

const consumerRaw = kafka.consumer({ groupId: GROUPID_RAW });
const consumerAgg = kafka.consumer({ groupId: GROUPID_AGG });

const wss = new WebSocket.Server({ port: 8080 }); // new websocket server

// handle WebSocket connections with browsers
wss.on("connection", function connection(ws) {
  console.log("\x1b[32m ----new ws connection!---- \x1b[32m");
  clients.add(ws); // add client to Set

  ws.on("close", (code, reason) => {
    console.log("\x1b[32m ----ws disconnected---- \x1b[32m");
    clients.delete(ws);
  });

  ws.on("error", (err) => {
    console.log("WebSocket error:", err);
    clients.delete(ws);
  });
});

// handle raw-emote-data kafka connection
(async () => {
  await consumerRaw.connect();
  await consumerRaw.subscribe({ topic: TOPIC_RAW, fromBeginning: true });

  await consumerRaw.run({
    eachMessage: async ({ topic, partition, message }) => {
      const stringMsg = message.value.toString();
      //console.log({ value: stringMsg }); // show messages in console

      // Broadcast to all connected clients
      for (let client of clients) {
        if (client.readyState === client.OPEN) {
          const parsedMsg = JSON.parse(stringMsg);
          const msgWithType = { ...parsedMsg, type: "raw" };
          client.send(JSON.stringify(msgWithType));
        }
      }
    },
  });
})();

// handle aggregated-emote-data kafka connection
(async () => {
  await consumerAgg.connect();
  await consumerAgg.subscribe({ topic: TOPIC_AGG, fromBeginning: true });

  await consumerAgg.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log("[aggregated-emote-data] received:", message.value.toString());
      const parsedMsg = JSON.parse(message.value.toString());
      const msgWithType = { ...parsedMsg, type: "significant" };
      const stringMsg = JSON.stringify(msgWithType);

      // Broadcast to all connected clients
      for (let client of clients) {
        if (client.readyState === client.OPEN) {
          client.send(stringMsg);
        }
      }
    },
  });
})();
