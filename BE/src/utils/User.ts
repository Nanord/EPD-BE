import NodeCache from 'node-cache-promise';
import axios from 'axios';
import Logger from "./logger/Logger";
import Redis from "./Redis";

namespace User {

    export async function check(session: string) {
        Logger.access().log("check user: " + session);
        if (!session && typeof session === 'undefined') {
            let msg = "Incorrect Session";
            Logger.access().warning(msg);
            throw new Error(msg);
        }
        //FUCK
        if (process.env.SMORODINA_EPD_FAKEID === "true") {
            Logger.access().log("Debug session");
            return require('../../../__debugUserInfo').default;
        }
        let user = await Redis.get("user:" + session);
        if (user) {
            Logger.access().log("User found in DB" + user.data);
            return user;
        }

        let url = '';
        url = process.env.SMORODINA_ACCESS_SERVER_HOST + 'check?session=' + session;
        Logger.access().log("Request to " + url);
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url,
                timeout: 3000
            }).then(response => {
                Logger.access().log("response is successful");
                const data = response.data;
                if (typeof data === "object") {
                    Logger.access().log("res: " + data.ok + " " + data.result);
                    if (data.ok == true) {
                        const user = {
                            ...data.result,
                            isSuperuser: data.result.login === "superuser"
                        };
                        Redis.setex("user:" + session, JSON.stringify(user));
                        resolve(user)
                    } else {
                        let msg = "User not found";
                        Logger.access().warning(msg);
                        reject(msg)
                    }
                } else {
                    let msg = "Error occured while user session check";
                    Logger.access().error(msg);
                    reject(msg);
                }
            }).catch(error =>{
                if (error.message) {
                    Logger.access().error(error.message);
                    reject(error.message);
                }
                else {
                    Logger.access().error(error.toString());
                    reject(error);
                }
            })
        });
    }
}
export default User;