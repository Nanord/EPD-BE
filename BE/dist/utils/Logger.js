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
var moment_1 = __importDefault(require("moment"));
var DataBase_1 = __importDefault(require("./DataBase"));
var Socket_1 = __importDefault(require("../api/Socket"));
var LogTypes;
(function (LogTypes) {
    LogTypes[LogTypes["MESSAGE"] = 0] = "MESSAGE";
    LogTypes[LogTypes["WARNING"] = 1] = "WARNING";
    LogTypes[LogTypes["ERROR"] = 2] = "ERROR";
})(LogTypes || (LogTypes = {}));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.getInstance = function () {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    };
    Logger.prototype.timestamp = function () {
        return moment_1.default().format(Logger.format);
    };
    Logger.prototype.print = function (message, type) {
        switch (type) {
            case LogTypes.ERROR:
                console.error("[" + this.timestamp() + "] " + message);
                break;
            case LogTypes.WARNING:
                console.warn("[" + this.timestamp() + "] " + message);
                break;
            case LogTypes.MESSAGE:
            default:
                console.log("[" + this.timestamp() + "] " + message);
        }
    };
    Logger.message = function (message) {
        Logger.getInstance().print(message, LogTypes.MESSAGE);
    };
    Logger.log = function (message) {
        Logger.message(message);
    };
    Logger.error = function (message) {
        Logger.getInstance().print(message, LogTypes.ERROR);
    };
    Logger.warning = function (message) {
        Logger.getInstance().print(message, LogTypes.WARNING);
    };
    /**
     * Записать в БД
     * + сделать bc
     */
    Logger.stacktraсe = function (errorText, stack) {
        if (stack === void 0) { stack = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, _b, _c, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!stack) {
                            stack = "";
                        }
                        if (stack && typeof stack !== "string") {
                            //@ts-ignore
                            stack = stack.toString();
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, DataBase_1.default("ErrorCreate", {
                                name: errorText,
                                stack: stack || 'No stacktrace',
                                timestamp: new Date()
                            })];
                    case 2:
                        res = _d.sent();
                        Logger.error("Error " + res.id + ": " + errorText);
                        // FUCK
                        console.log("Что то отправляю админам");
                        _b = (_a = Socket_1.default).sendToAdmin;
                        _c = {
                            name: "NewError"
                        };
                        return [4 /*yield*/, DataBase_1.default("ErrorList", res)];
                    case 3:
                        _b.apply(_a, [(_c.data = _d.sent(),
                                _c)]);
                        return [2 /*return*/, res.id];
                    case 4:
                        error_1 = _d.sent();
                        Logger.error(errorText);
                        Logger.error("Ошибка работы с БД " + error_1.message);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Logger.format = 'YYYY-MM-DD HH:mm:ss.SSS';
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=Logger.js.map