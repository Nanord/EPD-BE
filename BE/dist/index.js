"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Const_1 = __importDefault(require("./Const"));
require('dotenv').config();
var Methods = __importStar(require("./api"));
var Socket_1 = __importDefault(require("./api/Socket"));
var compression_1 = __importDefault(require("compression"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var currentRoot = process.execPath;
if (!__dirname.match("/snapshot/")) {
    currentRoot = __dirname;
}
/**
 * HTTP
 * SERVER
 */
var app = express_1.default();
app.use(function (req, res, next) {
    res.header("x-powered-by", "SMORODINA");
    res.header("Access-Control-Allow-Origin", Const_1.default.SMORODINA_ALLOW_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression_1.default());
/**
 * Внешний API
 */
app.post("/api/:method", function (req, res) {
    res.set('Content-Type', 'application/json; charset=utf-8');
    var result = { ok: false, code: 1000, message: "Sorry but no..." };
    var Method = Methods[req.params.method];
    if (!Method) {
        res.status(200).send(result);
        return;
    }
    Method.executor(req.body, function (response) { return res.status(200).send(response); });
    // if (req.headers["content-type"] == "application/json") {
    //     Method(req.body, (response: any) => res.status(200).send(response));
    // } else {
    //     result.message = "Wrong header"
    //     res.status(200).send(result);
    // }
});
app.all("/ok", function (req, res) { return res.send("OK"); });
var server = require('http').Server(app);
server.listen(Const_1.default.SMORODINA_MOD_EPD_PORT);
/**
 * WS
 * SERVER
 */
Socket_1.default.start(server);
/**
 * Приветсвие
 */
console.log("LISTEN " + Const_1.default.SMORODINA_MOD_EPD_PORT + " ");
