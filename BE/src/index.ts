require('dotenv').config();

import * as Methods from './api';
import Service from './api/Service';
import Socket from './api/Socket';
import compression, { filter } from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import {router} from "websocket";
import path from 'path'
import Logger from "./utils/logger/Logger";
import Redis from "./utils/Redis";

let currentRoot = process.execPath;

if (!__dirname.match("/snapshot/")) {
    currentRoot = __dirname;
}

/**
 * HTTP
 * SERVER
 */
const app = express();

app.use((req, res, next) => {
    res.header("x-powered-by", "SMORODINA");
    //FUCK
    res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Origin", process.env.SMORODINA_ALLOW_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());

/**
 * Внешний API
 */
app.post("/api/:method", (req, res) => {
    Logger.log("/api/" + req.params.method);
    res.set('Content-Type', 'application/json; charset=utf-8');

    let result = { message: "Method not fond" };
    const Method = Methods[req.params.method.toLowerCase()] as Service;
    if (!Method) {
        res.status(404).send(result);
        return;
    }

    Method.executor(req.body, (response: any) => res.status(200).send(response));

    // if (req.headers["content-type"] == "application/json") {
    //     Method(req.body, (response: any) => res.status(200).send(response));
    // } else {
    //     result.message = "Wrong header"
    //     res.status(200).send(result);
    // }
});

app.all("/ok", (req, res) => res.send("OK"));

app.use((req, res, next) => {
    res.status(404);
    Logger.log('Not found URL: ' + req.url);
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    Logger.error('Internal error(' + 500 + ") " + err.message);
    res.send({ error: err.message });
    return;
});


const server = require('http').Server(app);

server.listen(process.env.SMORODINA_EPD_PORT);


/**
 * WS
 * SERVER
 */
Socket.start(server);

/**
 * Приветсвие
 */
console.log(`LISTEN ${process.env.SMORODINA_EPD_PORT}`);