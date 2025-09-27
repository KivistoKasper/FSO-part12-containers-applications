const { Kafka } = require('kafkajs');
const { Emote, AllowedEmote, Interval } = require('../db/db');
const { analyzeEmotes } = require('./analyzer');

let cachedInterval = 100;

const updateInterval = async () => {
  try {
    const storedInterval = await Interval.findOne();
    if (storedInterval) {
      cachedInterval = storedInterval.interval;
    }
  } catch (error) {
    console.error('Error updating interval:', error);
  }
}

const GROUPID = 'raw-emote-group';
const TOPIC = 'raw-emote-data';

const kafka = new Kafka({
  clientId: 'server-b',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9094']
});

const consumer = kafka.consumer({ groupId: GROUPID });
const producer = kafka.producer();

const run = async () => {
  setInterval(updateInterval, 10 * 1000);
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
  let count = 0;
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const parsedMessage = JSON.parse(message.value.toString());
        if (await AllowedEmote.findOne({ where: { emote: parsedMessage.emote }, }) !== null) {
          await Emote.create({
            ...parsedMessage,
            isAnalyzed: false,
          });
          count++;
        }

        if (cachedInterval <= count) {
          await sendSignificantMoments();
          count = 0;
        }
      } catch (error) {
        console.error('Error processing kafka message:', error);
      }
    },
  });
};

const sendSignificantMoments = async () => {
  const significantMoments = await analyzeEmotes();
  await producer.connect();
  const allowedEmotes = await AllowedEmote.findAll({
    where: { isAllowed: true },
  });
  for (const moment of significantMoments) {
    if (allowedEmotes.some(emote => emote.emote === moment.emote)){
      await producer.send({
        topic: 'aggregated-emote-data',
        messages: [{ value: JSON.stringify(moment) }],
      });
    }
  }
};

module.exports = run;
