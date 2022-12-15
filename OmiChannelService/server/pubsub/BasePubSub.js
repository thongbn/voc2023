import {publishClient, subClient} from "../database/RedisClient";

export class BasePubSub {

    constructor(topic) {
        this.topic = topic;
        this.baseTopic = process.env.APP_PUBLISHER_TOPIC ? process.env.APP_PUBLISHER_TOPIC : "app_default_topic";
    }

    getTopic() {
        return `${this.baseTopic}/${this.topic}`;
    }

    publish(path, data) {
        publishClient().publish(`${this.getTopic()}/${path}`, JSON.stringify(data));
    }

    subscribe(path, callback) {
        subClient().subscribe(`${this.getTopic()}/${path}`, message => {
            try {
                callback(JSON.parse(message));
            } catch (e) {
                callback(message);
            }
        });
    }
}