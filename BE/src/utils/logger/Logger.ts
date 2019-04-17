import moment = require("moment");

enum LogTypes {
    MESSAGE,
    WARNING,
    ERROR
}
class Logger{

    //private static format: string = 'YYYY-MM-DD HH:mm:ss.SSS';
    private static userIP:string = "empty";
    private static instance: Logger;

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    public static setUserIP(userIP) {
        this.userIP = userIP;
    }

    /*private timestamp(): string {
        return moment().format(Logger.format);
    }*/

    private async print(message: string, type: LogTypes) {
        switch (type) {
            case LogTypes.ERROR:
                //console.error(`[${this.timestamp()}] ${message}`);
                console.error(`userIP: ${Logger.userIP} message: ${message}`);
                break;
            case LogTypes.WARNING:
                //console.warn(`[${this.timestamp()}] ${message}`);
                console.warn(`userIP: ${Logger.userIP} message: ${message}`);
                break;
            case LogTypes.MESSAGE:
            default:
                //console.log(`[${this.timestamp()}] ${message}`);
                console.log(`userIP: ${Logger.userIP} message: ${message}`);
        }
    }

    static async message(message: string) {
        if(process.env.DEBUG === 'true') {
            Logger.getInstance().print(message, LogTypes.MESSAGE);
        }
    }

    static async log(message: string) {
        if(process.env.DEBUG === 'true') {
            Logger.message(message);
        }
    }

    static async error(message: string) {
        Logger.getInstance().print(message, LogTypes.ERROR);
    }

    static async warning(message: string) {
        if(process.env.DEBUG === 'true') {
            Logger.getInstance().print(message, LogTypes.WARNING);
        }
    }

}

export default Logger