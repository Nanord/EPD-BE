import moment from 'moment';
import Socket from '../../api/Socket';
import {type} from "os";
import LogDB from "./LogDB";
import LogAccess from "./LogAccess";
import LogSod from "./LogSod";
import LogMethods from "./LogMethods";
import LogWS from "./LogWS";

enum LogTypes {
    MESSAGE,
    WARNING,
    ERROR
}
class Logger {

    private static format: string = 'YYYY-MM-DD HH:mm:ss.SSS';
    private static instance: Logger;

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private timestamp(): string {
        return moment().format(Logger.format);
    }

    private print(message: string, type: LogTypes): void {
        switch (type) {
            case LogTypes.ERROR:
                console.error(`[${this.timestamp()}] ${message}`);
                break;
            case LogTypes.WARNING:
                console.warn(`[${this.timestamp()}] ${message}`);
                break;
            case LogTypes.MESSAGE:
            default:
                console.log(`[${this.timestamp()}] ${message}`);
        }
    }

    static message(message: string): void {
        if(process.env.DEBUG === 'true') {
            Logger.getInstance().print(message, LogTypes.MESSAGE);
        }
    }

    static log(message: string): void {
        if(process.env.DEBUG === 'true') {
            Logger.message(message);
        }
    }

    static error(message: string): void {
        Logger.getInstance().print(message, LogTypes.ERROR);
    }

    static warning(message: string): void {
        if(process.env.LOG_WARNING === 'true') {
            Logger.getInstance().print(message, LogTypes.WARNING);
        }
    }

    static db() {
        if(process.env.LOG_DB === 'true') {
            return LogDB;
        }
        return Logger
    }

    static access() {
        if(process.env.LOG_ACCESS === 'true') {
            return LogAccess;
        }
        return Logger
    }

    static sod() {
        if(process.env.LOG_SOD === 'true') {
            return LogSod;
        }
        return Logger
    }

    static methods() {
        if(process.env.LOG_METHODS === 'true') {
            return LogMethods;
        }
        return Logger
    }

    static ws() {
        if(process.env.LOG_WS === 'true') {
            return LogWS;
        }
        return Logger
    }
}
export default Logger;
