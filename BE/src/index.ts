import Const from "./Const";

require('dotenv').config();

import * as Methods from './api';
import Service from './api/Service';
import Socket from './api/Socket';
import compression, { filter } from 'compression';
import express from 'express';
import bodyParser from 'body-parser';

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
    res.header("Access-Control-Allow-Origin", Const.SMORODINA_ALLOW_ORIGIN);
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
    res.set('Content-Type', 'application/json; charset=utf-8');

    let result = { ok: false, code: 1000, message: "Sorry but no..." };

    const Method = Methods[req.params.method] as Service;

    if (!Method) {
        res.status(200).send(result);
        return;
    }

    Method.executor(req.body, (response: any) => res.status(200).send(response));

    // if (req.headers["content-type"] == "application/json") {
    //     Method(req.body, (response: any) => res.status(200).send(response));
    // } else {
    //     result.message = "Wrong header"
    //     res.status(200).send(result);
    // }
})

app.all("/ok", (req, res) => res.send("OK"));

const server = require('http').Server(app)

server.listen(Const.SMORODINA_MOD_EPD_PORT);

/**
 * WS
 * SERVER
 */
Socket.start(server);

/**
 * Приветсвие
 */
console.log(`LISTEN ${Const.SMORODINA_MOD_EPD_PORT} `);