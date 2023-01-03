import { Kafka } from 'kafkajs';
import crypto from 'crypto';
import { getKafkaSettings } from './services/ConfigService';
import { handleFacebookService } from './services/FacebookSerivce';
import { handleInstagramService } from './services/InstagramService';
import { handleZlService } from './services/ZaloService';

let kafka;
let consumer;
export default {
    async init() {
        const settings = await getKafkaSettings();
        kafka = new Kafka({
            clientId: settings.clientId,
            brokers: settings.brokers.split(",")
        });
        consumer = kafka.consumer({
            groupId: process.env.KAFKA_GROUP_ID
        });
    },

    async connect() {
        try {
            console.log('Kafka Consumer connecting...');
            consumer.connect();
            await consumer.subscribe({
                topics: [
                    process.env.KAFKA_TOPIC_FB,
                    process.env.KAFKA_TOPIC_INSTAGRAM,
                    process.env.KAFKA_TOPIC_ZALO,
                ]
            });
            console.log('Kafka Consumer running...');
            consumer.run({
                partitionsConsumedConcurrently: 3, // Default: 1
                eachMessage: async ({ topic, partition, message }) => {
                    console.log("topic | partition | message: ", topic, partition, message)
                    try {
                        switch (topic) {
                            case process.env.KAFKA_TOPIC_FB:
                                handleFacebookService(message);
                                break;
                            case process.env.KAFKA_TOPIC_INSTAGRAM:
                                handleInstagramService(message);
                                break;
                            case process.env.KAFKA_TOPIC_INSTAGRAM:
                                handleZlService(message);
                                break;
                            default:
                                throw new Error("Unhandle topic", topic, message);
                        }
                    } catch (e) {
                        console.log("Errors: ", message);
                        console.error(e);
                    }
                },
            });
        } catch (e) {
            throw e;
        }
    },
}