import Logger from "./Logger";

export default class LogSod {
    static log(message: string): void {
        Logger.log("Sod: " + message)
    }

    static warning(message: string): void {
        Logger.warning("Sod: " + message)
    }

    static error(message: string): void {
        Logger.error("Sod: " + message)
    }
}