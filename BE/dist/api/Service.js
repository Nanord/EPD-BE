"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __importDefault(require("./Errors"));
var Service = /** @class */ (function () {
    function Service(opt) {
        this.name = "Unknown";
        this.description = "";
        this.name = opt.name;
        if (opt.description) {
            this.description = opt.description;
        }
        this.on = opt.on;
    }
    Service.prototype.executor = function (req, res) {
        /**
         * Для безопастного выполнения
         * сервиса без ответа
         */
        if (typeof res !== 'function') {
            res = function () { };
        }
        /**
         * Ошибка с кодом 2 если нет запроса
         */
        if (!req) {
            return SendError.bind(this)(2);
        }
        /**
         * Обратная совместимость для старых версий
         */
        if (!req.version) {
            req.version = 1;
        }
        /**
         * Вернуть ответ API
         */
        function SendSuccess(result) {
            if (result === void 0) { result = null; }
            this({ ok: true, code: 0, message: "OK", result: result });
        }
        ;
        /**
         * Вернуть ошибку
         */
        function SendError(code, message) {
            if (code === void 0) { code = 1; }
            if (message === void 0) { message = ""; }
            var msg = message || (Errors_1.default[code] ? Errors_1.default[code].message : "Ошибка");
            this({ ok: false, code: code, message: msg, result: null });
        }
        /**
         * res - pipe функция в которую нужно передать результат
         * делаем bind для SendSuccess и SendError на pipe res
         * для того чтобы они могли передать ответ
         */
        return this.on.bind(this)(req, SendSuccess.bind(res), SendError.bind(res));
    };
    /**
     * Выполнить сервис
     * Отдельная функция для выполнения сервиса
     */
    Service.prototype.exec = function (params) {
        var _this = this;
        return new Promise(function (SendSuccess, SendError) {
            _this.on.bind(_this)(params, SendSuccess, function (code, message) {
                var msg = message || (Errors_1.default[code] ? Errors_1.default[code].message : "Ошибка");
                SendError({
                    code: code,
                    message: msg
                });
            }, true);
        });
    };
    return Service;
}());
exports.default = Service;
