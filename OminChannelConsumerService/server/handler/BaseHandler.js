export default class BaseHandler {
    /**
     * @type string
     */
    topic;
    /**
     * @type string
     */
    platform;

    constructor(topic, platform) {
        this.topic = topic;
        this.platform = platform;
    }

    handle(message) {

    };
}