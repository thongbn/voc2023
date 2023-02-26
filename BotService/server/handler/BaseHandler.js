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
        this.topic = `${process.env.QUEUE_PREFIX}_${topic}`;
        this.platform = platform;
    }

    async handle(message) {
        console.log("Un-implements handle");
    };
}