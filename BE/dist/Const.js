"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Const = /** @class */ (function () {
    function Const() {
    }
    //BE general config
    Const.SMORODINA_ALLOW_ORIGIN = "*";
    //BE config
    Const.SMORODINA_MOD_EPD_PORT = "7676";
    Const.SMORODINA_MOD_EPD_FAKEID = "true";
    //BE static public sma config
    Const.SMA_HOST = "172.16.200.193";
    Const.SMA_PORT = "4466";
    //BE sod config
    Const.SMORODINA_MOD_EPD_SOD_ENDPOINT = "http://172.16.200.193:8077/SOD";
    //BE Access config
    Const.SMORODINA_ACCESS_SERVER_HOST = "172.16.200.193";
    Const.SMORODINA_ACCESS_SERVER_PORT = "8050";
    //FE general config
    Const.SMORODINA_BUILD_TYPE = "testflight";
    Const.SMORODINA_BUILD_ANALYZ = "false";
    Const.SMORODINA_BUILD_SOURCE_MAP = "true";
    //FE mod config
    Const.SMORODINA_BUILD_MOD_EPD_HOST = "172.16.200.193:7676";
    Const.SMORODINA_BUILD_MOD_EPD_HTTPS = "false";
    Const.SMORODINA_BUILD_MOD_EPD_APIV = "1";
    Const.SMORODINA_REACT_EXTERNAL = "false";
    //BE prisma
    Const.SMORODINA_MOD_EPD_PRISMA_HOST = "127.0.0.1";
    Const.SMORODINA_MOD_EPD_PRISMA_PORT = "4466";
    return Const;
}());
exports.default = Const;
