"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Logger_1 = __importDefault(require("../utils/Logger"));
var Sod = /** @class */ (function () {
    function Sod() {
    }
    Sod.getInstance = function () {
        if (Sod.instance == null) {
            Sod.instance = new Sod();
        }
        return Sod.instance;
    };
    Sod.prototype.jsonEncode = function (s) {
        var ret = "";
        for (var i = 0; i < s.length; i++) {
            var chr = void 0;
            if (s[i].match(/[^\x00-\x7F]/)) {
                chr = "\\u" + ("000" + s[i].charCodeAt(0).toString(16)).substr(-4);
            }
            else {
                chr = s[i];
            }
            ret = ret + chr;
        }
        return ret;
    };
    /**
     * Выполнить запрос в СОД
     * @param {Object} params
     * @param {Object} out_params
     */
    Sod.prototype.performQuery = function (params, out_params, needUnicode) {
        if (params === void 0) { params = {}; }
        if (out_params === void 0) { out_params = {}; }
        if (needUnicode === void 0) { needUnicode = false; }
        var name = "хз";
        var org = -1;
        if (typeof params === 'undefined' || typeof name === 'undefined') {
            throw ("Параметры функции должны быть опеределены");
        }
        var requestObject = { name: name, org: org, params: params, out_params: out_params };
        var json = JSON.stringify(requestObject);
        if (needUnicode) {
            json = this.jsonEncode(json);
        }
        //@ts-ignore
        //const url = `http://${process.env.SMORODINA_SOD_SERVER_HOST}:${process.env.SMORODINA_SOD_SERVER_PORT}/${process.env.SMORODINA_SOD_SERVER_PATH}`;
        var url = "http://172.16.200.191:8077/SOD";
        return new Promise(function (resolve, reject) {
            axios_1.default({
                method: 'POST',
                url: url,
                timeout: 90000,
                data: {
                    provider: "sodInternal",
                    json: json
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then(function (res) {
                if (!res.data) {
                    reject({
                        message: "Ошибка работы с СОД",
                        err: 'Отсутствует информация!'
                    });
                    return;
                }
                if (res.data.result.code == "1004") {
                    resolve(res.data.contents);
                }
                else {
                    Logger_1.default.error("SOD !! (" + res.data.result.code + ") " + res.data.result.message);
                    reject({
                        err: res.data.result.message,
                        message: "Ошибка работы с СОД"
                    });
                }
            })
                .catch(function (error) {
                //@ts-ignore
                if (error.message) {
                    Logger_1.default.error("SOD !! " + error.message);
                }
                else {
                    Logger_1.default.error("SOD !! " + error.toString());
                }
                reject({
                    err: error.message,
                    message: "Ошибка работы СОД"
                });
            });
        });
    };
    return Sod;
}());
exports.default = Sod.getInstance();
//# sourceMappingURL=Sod.js.map