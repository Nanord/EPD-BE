import websocket, { server, connection } from 'websocket';
import Logger from "./logger/Logger";



class WS {

    wsServer: server;
    SOCKETS: connection[] = [];

    start(server) {
        this.wsServer = new websocket.server({
            httpServer: server,
            //TODO: для прода надо сделать проверку origin 
            autoAcceptConnections: false
        });
        this.wsServer.on('request', (request) => {
            try {
                const connection = request.accept();
                const index = this.SOCKETS.push(connection) - 1;

                connection.on('close', () => this.SOCKETS.splice(index, 1));
                connection.on('message', async (data) => {
                    if (data.type === "utf8") {
                        /**
                         * Ping Pong
                         */
                        if (data.utf8Data === "0x00") {
                            connection.send("0x01");
                            return;
                        }
                    }
                    this.onMessage(data, connection);
                });

            } catch (error) {
                console.log(error + "\n" + error.stack);
            }
        });
    }

    hasClientsConnected() {
        return !!this.SOCKETS.length;
    }

    onMessage(data, connection) {
        //on data recieved
        Logger.ws().log(".onMessage: " + data.toString())
    }

    attachUser(connection: connection, user: any) {
        //@ts-ignore
        connection.user = user;
    }

    sendMessageByMatch(message: string, matcher: (user, socket) => boolean) {
        //FUCK
        Logger.ws().log("точно отправил " + message + "\n\t" + this.SOCKETS.length);
        this.SOCKETS
            .forEach(function (socket) {
                Logger.ws().log("Адресс " + socket.remoteAddress + "\n")
            });
        if (this.hasClientsConnected()) {
            this.SOCKETS
                //@ts-ignore
                .filter(socket => socket.user && matcher(socket.user, socket))
                .map(socket => socket.send(message))
        }
    }

    sendBySession(name: string, data: {}, session: string) {
        this.sendMessageByMatch(JSON.stringify({name, data} ), user => user.session === session)
    }

    sendByUserId(name: string, data: {}, userId: string) {
        this.sendMessageByMatch(JSON.stringify(data), user => user.id === userId)
    }

    sendByUserRoles(name: string, data: {}, userRoles: string[]) {
        this.sendMessageByMatch(JSON.stringify(data), user =>
            user.roles.findIndex(socketRole =>
                userRoles.findIndex(role => role === socketRole.name) >= 0
            ) >= 0
        )
    }

    broadcast(name: string, data: {}) {
        this.SOCKETS.forEach(socket => socket.send(JSON.stringify({name, data })));
    }

    stop() {
        this.wsServer.closeAllConnections();
        this.wsServer.shutDown();
    }
}

export default WS;