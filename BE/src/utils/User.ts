import NodeCache from 'node-cache-promise';
import axios from 'axios';
import Logger from "./logger/Logger";
import Redis from "./Redis";

namespace User {

    export async function check(session: string) {
        Logger.log("ACCESS: " + "check user: " + session);
        if (!session && typeof session === 'undefined') {
            let msg = "Incorrect Session";
            Logger.warning("ACCESS: " + msg);
            throw new Error(msg);
        }
        
        if (process.env.SMORODINA_EPD_FAKEID === "true") {
            Logger.log("ACCESS: " + "Debug session");
            return require('../__debugUserInfo').default;
        }
        let user = await Redis.get("user:" + session);
        if (user) {
            Logger.log("ACCESS: " + "User found in DB" + user.data);
            return user;
        }

        let url = '';
        url = process.env.SMORODINA_ACCESS_SERVER_HOST + 'check?session=' + session;
        Logger.log("ACCESS: " + "Request to " + url);
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url,
                timeout: 3000
            }).then(response => {
                Logger.log("ACCESS: " + "response is successful");
                const data = response.data;
                if (typeof data === "object") {
                    Logger.log("ACCESS: " + "res: " + data.ok + " " + data.result);
                    if (data.ok == true) {
                        const user = {
                            ...data.result,
                            isSuperuser: data.result.login === "superuser"
                        };
                        Redis.setex("user:" + session, JSON.stringify(user));
                        resolve(user)
                    } else {
                        let msg = "User not found";
                        Logger.warning("ACCESS: " + msg);
                        reject(msg)
                    }
                } else {
                    let msg = "Error occured while user session check";
                    Logger.error("ACCESS: " + msg);
                    reject(msg);
                }
            }).catch(error =>{
                if (error.message) {
                    Logger.error("ACCESS: " + error.message);
                    reject(error.message);
                }
                else {
                    Logger.error("ACCESS: " + error.toString());
                    reject(error);
                }
            })
        });
    }
}
export default User;