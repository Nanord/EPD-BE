"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchPhone = function (phone) {
    return phone.match(/^\+7([\d]{10}$)/);
};
exports.splitPhones = function (phones) {
    if (phones === void 0) { phones = ""; }
    var phonesArray = [];
    if (!phones) {
        return phonesArray;
    }
    phones.split(",").forEach(function (phone) {
        if (exports.matchPhone(phone.trim())) {
            phonesArray.push(phone.trim());
        }
    });
    return phonesArray;
};
//# sourceMappingURL=matchPhone.js.map