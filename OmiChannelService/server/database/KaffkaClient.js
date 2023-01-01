import {Kafka} from 'kafkajs';

class KafkaClient {
    constructor(clientId, brokers) {
        this.kafka = new Kafka({
            clientId: clientId,
            brokers: brokers
        });
        this.producer = this.kafka.producer();
    }

    async connect() {
        try {
            console.log('Kafka Producer connecting...');
            await this.producer.connect();
        } catch (e) {
            throw e;
        }
    }

    /**
     *
     * @param topic string
     * @param messages any
     * @returns {Promise<RecordMetadata[]>}
     */
    async send(topic, messages) {
        return await this.producer.send({
            topic,
            messages
        });
    }

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
    }

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
    }

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
    }
}


const kafkaClient = new KafkaClient(
    process.env.KAFKA_CLIENT_ID,
    process.env.KAFKA_BROKER.split(",")
);

/**
 * KafkaClient singleton
 */
export default kafkaClient;