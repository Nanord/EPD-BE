import WS from '../utils/WS';
import Logger from '../utils/logger/Logger';
import User from '../utils/User';
import {connection} from "websocket";
class Socket extends WS {

    static instance: Socket;
    static getInstance() {
        if (!this.instance) {
            this.instance = new Socket()
        }
        return this.instance;
    }

    async onMessage(data: any, connection: connection) {
        if (data.type !== "utf8") {
            Logger.ws().warning("Socket message with type " + data.type + " ignored.");
            return;
        }
        try {
            const message = JSON.parse(data.utf8Data);

            switch (message.method) {
                case 'login':
                    try {
                        const user = await User.check(message.session);
                        /**
                         * Записываем пользователя в сокет
                         */
                        Logger.ws().log("Connected user:" + message.session)
                        this.attachUser(connection, user);

                    } catch (error) {
                        Logger.ws().warning("Invalid session on socket login " + message.session);
                    }
                    break;
                case 'subscribe':
                    try {
                        let name = "fuck you";
                        let data = {fuck:"you"};
                        connection.send(JSON.stringify({name, data}));
                    } catch (error) {
                        Logger.ws().warning("Invalid subsctibe" + message + error)
                    }
                    break;
                default:
                    Logger.ws().warning("Incorrect socket method called " + message.method);
            }
        } catch (error) {
            Logger.ws().error(error.message + "\n" + error.stack);
        }
    }

    /**
     * Отправить админам
     */
    sendToAdmin(data) {
        this.sendMessageByMatch(JSON.stringify(data), (user) =>
            (user.login === "superuser" || user.roles.findIndex(role => role.name === "EPD_ADMIN") >= 0)
        )
    }
}

export default Socket.getInstance();