"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = __importDefault(require("xlsx"));
var Excel = /** @class */ (function () {
    function Excel(type) {
        if (type === void 0) { type = "base64"; }
        this.options = { bookType: 'xlsx', bookSST: false, type: type };
        this.workbook = { SheetNames: [], Sheets: {}, Props: {} };
    }
    Excel.prototype.getData = function () {
        return xlsx_1.default.write(this.workbook, this.options);
    };
    Excel.prototype.createSheet = function (name, data, type) {
        if (type === void 0) { type = "ARRAY"; }
        var sheet;
        switch (type) {
            case "JSON":
                sheet = xlsx_1.default.utils.json_to_sheet(data);
                break;
            case "TABLE":
                sheet = xlsx_1.default.utils.table_to_sheet(data);
                break;
            case "ARRAY":
            default:
                sheet = xlsx_1.default.utils.aoa_to_sheet(data);
                break;
        }
        this.workbook.SheetNames.push(name);
        this.workbook.Sheets[name] = sheet;
        return true;
    };
    return Excel;
}());
exports.default = Excel;
//# sourceMappingURL=Excel.js.map