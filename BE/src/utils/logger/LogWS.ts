import Logger from "./Logger";

export default class LogWS {
    static log(message: string): void {
        Logger.log("WS: " + message)
    }

    static warning(message: string): void {
        Logger.warning("WS: " + message)
    }

    static error(message: string): void {
        Logger.error("WS: " + message)
    }
}