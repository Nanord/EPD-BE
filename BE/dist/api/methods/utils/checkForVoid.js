"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(params, checkValues) {
    checkValues.forEach(function (key) {
        if (!params[key])
            throw new Error("\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 " + key + " \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D");
    });
    return true;
}
exports.default = default_1;
//# sourceMappingURL=checkForVoid.js.map