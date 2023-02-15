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

    async handle(message) {
        console.log("Un-implements handle");
    };
}