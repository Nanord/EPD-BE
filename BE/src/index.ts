import Const from "./Const";

require('dotenv').config();

import * as Methods from './api';
import Service from './api/Service';
import Socket from './api/Socket';
import compression, { filter } from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import {router} from "websocket";
import path from 'path'
import Logger from "./utils/Logger";
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
    res.header("Access-Control-Allow-Origin", Const.SMORODINA_ALLOW_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());
// Удалить в будующем
app.use(express.static(path.join(__dirname, "public")));

// app.use(function(req, res, next){
//     res.status(404);
//     Logger.log('Not found URL: ' + req.url);
//     res.status(404);
//     res.send({ error: 'Not found' });
//     return;
// });

// app.use(function(err, req, res, next){
//     res.status(err.status || 500);
//     Logger.error('Internal error(' + res.status + ") " + err.message);
//     res.send({ error: err.message });
//     return;
// });
///

/**
 * Внешний API
 */
app.post("/api/:method", (req, res) => {
    Logger.log("/api/" + req.params.method);
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
});


app.get("/test", (req, res) => {
    res.sendFile(__dirname + "/test.html");
});

app.post("/test", (req, res) => {
    console.log("test");
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200)
    res.send("ХУЙ");
});

app.all("/ok", (req, res) => {
    let redis_res = Redis.get("fuck");

    console.log("OK");

    // @ts-ignore
    redis_res
        .then(
            result => {
                res.status(200);
                Logger.log("/OK res " + result);
                res.send(JSON.parse(result));
            },
            error => {
                res.status(500);
                Logger.log("/OK err " + error);
                res.send(JSON.parse(error));
            }
        );
});

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