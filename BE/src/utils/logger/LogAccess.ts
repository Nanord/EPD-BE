import Logger from "./Logger";

export default class LogAccess {
    static log(message: string): void {
        Logger.log("Access: " + message)
    }

    static warning(message: string): void {
        Logger.warning("Access: " + message)
    }

    static error(message: string): void {
        Logger.error("Access: " + message)
    }
}
