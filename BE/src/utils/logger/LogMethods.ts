import Logger from "./Logger";

export default class LogMethods {

    static log(message: string): void {
        Logger.log("Methods: " + message)
    }

    static warning(message: string): void {
        Logger.warning("Methods: " + message)
    }

    static error(message: string): void {
        Logger.error("Methods: " + message)
    }
}