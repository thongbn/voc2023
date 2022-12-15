import {createClient} from 'redis';

let client;
let subscriber;
let publisher;

export const redisConnect = async () => {
    const connectionString = `${process.env.REDIS_CONNECTION}/${process.env.REDIS_DB}`;
    client = createClient({
        url: connectionString
    });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();

    //
    subscriber = client.duplicate();
    await subscriber.connect();

    //
    publisher = client.duplicate();
    await publisher.connect();
};

export const redisClient = () => {
    return client;
};

export const subClient = () => {
    return subscriber;
};

export const publishClient = () => {
    return publisher;
};