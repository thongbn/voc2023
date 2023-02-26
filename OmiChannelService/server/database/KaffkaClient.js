import {Kafka} from 'kafkajs';
import crypto from 'crypto';

let kafka;
let producer;
export default {
    async init() {
        kafka = new Kafka({
            clientId: `${process.env.QUEUE_PREFIX}_${process.env.KAFKA_CLIENT_ID}`,
            brokers: process.env.KAFKA_BROKER.split(",")
                .map(item => `${process.env.QUEUE_PREFIX}_${item}`)
        });
        producer = kafka.producer({
            allowAutoTopicCreation: true,
        });
    },

    async connect() {
        try {
            console.log('Kafka Producer connecting...');
            await producer.connect();
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
        try {
            if (!process.env.KAFKA_TOPIC_FB) {
                throw new Error("Facebook topic null")
            }
            return this.send(process.env.KAFKA_TOPIC_FB, messages);
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
        try {
            if (!process.env.KAFKA_TOPIC_INSTAGRAM) {
                throw new Error("Instagram topic null")
            }
            return this.send(process.env.KAFKA_TOPIC_INSTAGRAM, messages);
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
        try {
            if (!process.env.KAFKA_TOPIC_ZALO) {
                throw new Error("Zalo topic null")
            }
            return this.send(process.env.KAFKA_TOPIC_ZALO, messages);
        } catch (e) {
            throw e;
        }
    },
}