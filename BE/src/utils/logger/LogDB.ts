import Logger from "./Logger";

export default class LogDB{

    static log(message: string): void {
        Logger.log("DB: " + message);
    }

    static warning(message: string): void {
        Logger.warning("DB: " + message);
    }

    static error(message: string): void {
        Logger.error("DB: " + message);
    }
}
