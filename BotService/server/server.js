import 'source-map-support/register';
require('dotenv').config();
import http from "http";
import db from "./models";
import { redisConnect } from "./RedisClient";
import KaffkaClient from "./KaffkaClient";

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

const port = normalizePort(process.env.PORT || '3000');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

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
};

const init = async () => {
    console.log("===== Init application =====");
    await db.sequelize.authenticate();
    console.log("Db authenticate - PASSED");
    await redisConnect();
    console.log("Redis connect - PASSED");
    await KaffkaClient.init();
    await KaffkaClient.connect();

}

server.listen(port, () => {
    console.log(`Server running at ${port}`);
    init();
});

server.on('error', onError);
server.on('listening', onListening);