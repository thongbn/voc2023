//CREATE SERVER
import http from "http";

import app from './app';
import debugLib from "debug";
import db from "./models";
import {redisConnect} from "./database/RedisClient";
import kafkaClient from "./database/KaffkaClient";
import {registerSub} from "./pubsub";

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const debug = debugLib('affiliate:server');
const port = normalizePort(process.env.PORT || '3000');

let server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
};

const init = async () => {
    try {
        console.log("===== Init application =====");
        await db.sequelize.authenticate();
        console.log("Db authenticate - PASSED");
        await redisConnect();
        console.log("Redis connect - PASSED");

        await kafkaClient.connect();
        console.log("Producer connected - PASSED");
        // await registerSub();
        // console.log("Subscribe listened - PASSED");
    } catch (e) {
        console.error("Error init:", e);
        process.exit(1);
    }
};

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, async () => {
    console.log(`Dolphin app listening on port ${port}!`);
    await init();
});
server.on('error', onError);
server.on('listening', onListening);