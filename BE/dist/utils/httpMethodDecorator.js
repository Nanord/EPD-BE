"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(value, f) {
    return function (target) {
        if (!target.method) {
            target.method = {};
        }
        target.method[value] = f;
    };
}
exports.default = default_1;
