import {Kafka} from 'kafkajs';
import {getKafkaSettings} from './services/ConfigService';
import FacebookHandler from "./handler/fb/FacebookHandler";
import IgHandler from "./handler/ig/IgHandler";

let kafka;
let consumer;
export default {

    handlers: {},

    /**
     *
     * @param {BaseHandler} handler
     */
    registerHandler(handler) {
        this.handlers[handler.topic] = handler;
    },

    async init() {
        const settings = await getKafkaSettings();
        kafka = new Kafka({
            clientId: settings.clientId,
            brokers: settings.brokers.split(",")
        });
        consumer = kafka.consumer({
            groupId: process.env.KAFKA_GROUP_ID
        });

        this.registerHandler(new FacebookHandler());
        this.registerHandler(new IgHandler());
    },

    async connect() {
        try {
            console.log('Kafka Bot Service connecting...');
            consumer.connect();
            await consumer.subscribe({
                topics: [
                    process.env.KAFKA_FB_BOT_TOPIC,
                    process.env.KAFKA_IG_BOT_TOPIC,
                    process.env.KAKFA_ZL_BOT_TOPIC,
                ]
            });
            console.log('Kafka Bot Service running...');
            consumer.run({
                partitionsConsumedConcurrently: 3, // Default: 1
                eachMessage: async ({topic, partition, message}) => {
                    console.log("topic | partition | message: ", topic, partition, message.value.toString());
                    try {
                        if (this.handlers[topic]) {
                            this.handlers[topic].handle(message);
                        } else {
                            throw new Error(`Topic: ${topic} handler not founded`);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                },
            });
        } catch (e) {
            throw e;
        }
    },    
}