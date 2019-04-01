"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = __importDefault(require("websocket"));
var WS = /** @class */ (function () {
    function WS() {
        this.SOCKETS = [];
    }
    WS.prototype.start = function (server) {
        var _this = this;
        this.wsServer = new websocket_1.default.server({
            httpServer: server,
            //TODO: для прода надо сделать проверку origin 
            autoAcceptConnections: false
        });
        this.wsServer.on('request', function (request) {
            try {
                var connection_1 = request.accept();
                var index_1 = _this.SOCKETS.push(connection_1) - 1;
                connection_1.on('close', function () { return _this.SOCKETS.splice(index_1, 1); });
                connection_1.on('message', function (data) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (data.type === "utf8") {
                            /**
                             * Ping Pong
                             */
                            if (data.utf8Data === "0x00") {
                                connection_1.send("0x01");
                                return [2 /*return*/];
                            }
                        }
                        this.onMessage(data, connection_1);
                        return [2 /*return*/];
                    });
                }); });
            }
            catch (error) {
                console.log(error + "\n" + error.stack);
            }
        });
    };
    WS.prototype.hasClientsConnected = function () {
        return !!this.SOCKETS.length;
    };
    WS.prototype.onMessage = function (data, connection) {
        //on data recieved
        console.log("WS.onMessage: " + data.toString());
    };
    WS.prototype.attachUser = function (connection, user) {
        //@ts-ignore
        connection.user = user;
    };
    WS.prototype.sendMessageByMatch = function (message, matcher) {
        //FUCK
        console.log("точно отправил " + message + "\n\t" + this.SOCKETS.length);
        this.SOCKETS
            .forEach(function (socket) {
            console.log("Адресс " + socket.remoteAddress + "\n");
        });
        //FUCK
        if (this.hasClientsConnected()) {
            this.SOCKETS
                //@ts-ignore
                .filter(function (socket) { return socket.user && matcher(socket.user, socket); })
                .map(function (socket) { return socket.send(message); });
        }
    };
    WS.prototype.sendBySession = function (name, data, session) {
        this.sendMessageByMatch(JSON.stringify({ name: name, data: data }), function (user) { return user.session === session; });
    };
    WS.prototype.sendByUserId = function (name, data, userId) {
        this.sendMessageByMatch(JSON.stringify(data), function (user) { return user.id === userId; });
    };
    WS.prototype.sendByUserRoles = function (name, data, userRoles) {
        this.sendMessageByMatch(JSON.stringify(data), function (user) {
            return user.roles.findIndex(function (socketRole) {
                return userRoles.findIndex(function (role) { return role === socketRole.name; }) >= 0;
            }) >= 0;
        });
    };
    WS.prototype.broadcast = function (name, data) {
        this.SOCKETS.forEach(function (socket) { return socket.send(JSON.stringify({ name: name, data: data })); });
    };
    return WS;
}());
exports.default = WS;
//# sourceMappingURL=WS.js.map