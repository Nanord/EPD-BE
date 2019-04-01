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
var path_1 = __importDefault(require("path"));
var Logger_1 = __importDefault(require("./utils/Logger"));
var Redis_1 = __importDefault(require("./utils/Redis"));
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
// Удалить в будующем
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
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
app.post("/api/:method", function (req, res) {
    Logger_1.default.log("/api/" + req.params.method);
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
app.get("/test", function (req, res) {
    res.sendFile(__dirname + "/test.html");
});
app.post("/test", function (req, res) {
    console.log("test");
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.status(200);
    res.send("ХУЙ");
});
app.all("/ok", function (req, res) {
    var redis_res = Redis_1.default.get("fuck");
    console.log("OK");
    // @ts-ignore
    redis_res
        .then(function (result) {
        res.status(200);
        Logger_1.default.log("/OK res " + result);
        res.send(JSON.parse(result));
    }, function (error) {
        res.status(500);
        Logger_1.default.log("/OK err " + error);
        res.send(JSON.parse(error));
    });
});
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
//# sourceMappingURL=index.js.map