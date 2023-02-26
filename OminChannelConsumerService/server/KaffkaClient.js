import {Kafka} from 'kafkajs';
import FacebookHandler from "./handler/fb/FacebookHandler";
import IgHandler from "./handler/ig/IgHandler";
import crypto from "crypto";
import ZaloHandler from "./handler/zalo/ZaloHandler";

let kafka;
let consumer;
let producer;

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
        kafka = new Kafka({
            clientId: `${process.env.QUEUE_PREFIX}_${process.env.KAFKA_CLIENT_ID}`,
            brokers: process.env.KAFKA_BROKER.split(",")
        });
        consumer = kafka.consumer({
            groupId: `${process.env.QUEUE_PREFIX}${process.env.KAFKA_GROUP_ID}`
        });

        producer = kafka.producer({
            allowAutoTopicCreation: true,
        });

        this.registerHandler(new FacebookHandler());
        this.registerHandler(new IgHandler());
        this.registerHandler(new ZaloHandler());
    },

    async connect() {
        try {
            console.log('Kafka Producer connecting...');
            await producer.connect();
            console.log('Kafka Consumer connecting...');
            await consumer.connect();
            await consumer.subscribe({
                topics: [
                    process.env.KAFKA_TOPIC_FB,
                    process.env.KAFKA_TOPIC_INSTAGRAM,
                    process.env.KAFKA_TOPIC_ZALO,
                ]
            });
            console.log('Kafka Consumer running...');
            await consumer.run({
                partitionsConsumedConcurrently: 3, // Default: 1
                eachMessage: async ({topic, partition, message}) => {
                    console.log("topic | partition | message: ", topic, partition, message.value.toString());
                    try {
                        if (this.handlers[topic]) {
                            await this.handlers[topic].handle(message);
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
    /**
     * @param topic string
     * @param messages any
     * @returns {Promise<RecordMetadata[]>}
     */
    async send(topic, messages) {
        const json = JSON.stringify(messages);
        console.log(topic, json);
        const key = crypto.createHash('md5')
            .update(json)
            .digest("hex");

        return await producer.send({
            topic: `${process.env.QUEUE_PREFIX}_${topic}`,
            messages: [
                {
                    key,
                    value: json
                }
            ]
        });
    },

    /**
     *
     * @param messages
     * @returns {Promise<RecordMetadata[]>}
     */
    async sendFacebook(messages) {
        if (process.env.PUBLISH_TO_NEW_CHATBOT_FB === "false") {
            return null;
        }

        try {
            if (!process.env.KAFKA_FB_BOT_TOPIC) {
                throw new Error("Facebook topic null")
            }
            return this.send(process.env.KAFKA_FB_BOT_TOPIC, messages);
        } catch (e) {
            throw e;
        }
    },

    /**
     *
     * @param messages any
     * @returns {Promise<RecordMetadata[]>}
     */
    async sendInstagram(messages) {
        if (process.env.PUBLISH_TO_NEW_CHATBOT_IG === "false") {
            return null;
        }
        try {
            if (!process.env.KAFKA_IG_BOT_TOPIC) {
                throw new Error("Instagram topic null")
            }
            return this.send(process.env.KAFKA_IG_BOT_TOPIC, messages);
        } catch (e) {
            throw e;
        }
    },

    /**
     *
     * @param messages any
     * @returns {Promise<RecordMetadata[]>}
     */
    async sendZalo(messages) {
        if (process.env.PUBLISH_TO_NEW_CHATBOT_ZL === "false") {
            return null;
        }
        try {
            if (!process.env.KAKFA_ZL_BOT_TOPIC) {
                throw new Error("Zalo topic null")
            }
            return this.send(process.env.KAKFA_ZL_BOT_TOPIC, messages);
        } catch (e) {
            throw e;
        }
    },

    /**
     *
     * @param {number} ticketId
     * @param {string} textMessage
     * @returns
     */
    async sendTag(ticketId, textMessage) {
        try {
            if (!process.env.KAKFA_ZL_BOT_TOPIC) {
                throw new Error("Zalo topic null")
            }
            return this.send(process.env.KAFKA_TAG_TOPIC, {
                ticketId,
                textMessage
            });
        } catch (e) {
            throw e;
        }
    },
}