const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "emotegenerator",
  brokers: [process.env.KAFKA_BROKER || "http://localhost:9094/"],
});

if (process.env.KAFKA_BROKER === "kafka:9092") {
  console.log("ENV URL IS CORRECT");
}

const admin = kafka.admin();
const producer = kafka.producer();

const emotes = ["❤️", "👍", "😢", "😡"];
const topic = "raw-emote-data";

const createTopics = async () => {
  await admin.connect();
  try {
    const existingTopics = await admin.listTopics();
    const topicsToCreate = ["raw-emote-data", "aggregated-emote-data"].filter(
      (topic) => !existingTopics.includes(topic)
    );

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      console.log("Created topics:", topicsToCreate);
    } else {
      console.log("Topics already exist, skipping creation.");
    }
  } catch (e) {
    console.error("Error while creating topics:", e);
  } finally {
    await admin.disconnect();
  }
};

const getRandomEmote = async () => {
  const emote = emotes[Math.floor(Math.random() * emotes.length)];
  const timestamp = new Date().toISOString();
  return { emote, timestamp };
};

const sendMessage = async (message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });

  //console.log('Message sent: ', message);
};

const generateEmotes = async () => {
  await createTopics();
  await producer.connect();
  setInterval(async () => {
    if (Math.random() < 0.2) {
      const burstEmote = emotes[Math.floor(Math.random() * emotes.length)];
      for (let i = 0; i < Math.floor(Math.random() * 51) + 50; i++) {
        const message = {
          emote: burstEmote,
          timestamp: new Date().toISOString(),
        };
        await sendMessage(message);
      }
    } else {
      for (let i = 0; i < Math.floor(Math.random() * 16) + 5; i++) {
        const message = await getRandomEmote();
        await sendMessage(message);
      }
    }
  }, 1000);
};

generateEmotes().catch(console.error);
