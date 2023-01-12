import * as dotenv from 'dotenv'

dotenv.config({path: `${__dirname}/../.env`});

import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import initRouter from './router';
import cors from 'cors';

const app = express();
app.use(cors({
    optionsSuccessStatus: 200
}));
app.use(express.static(`${__dirname}/../public`));

//Special
app.use(cookieParser());
app.use(express.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({extended: true}));

initRouter(app);

//APP CONFIG
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    return res.json(err);
});

export default app;
