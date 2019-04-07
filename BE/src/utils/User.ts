import NodeCache from 'node-cache-promise';
import axios from 'axios';
import Logger from "./Logger";
import Redis from "./Redis";

namespace User {
    //РЕДИС
    const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

    export async function check(session: string) {

        if (!session) {
            throw new Error("Incorrect Session");
        }
        Logger.log("session hier");
        //FUCK
        if (process.env.SMORODINA_MOD_EPD_FAKEID === "true") {
            return require('../../../__debugUserInfo').default;
        }
        //Реализовать через REDIS!
        let user = Redis.get(session);
        //const user = await cache.get(session);
        if (user) {
            return user;
        }

        let url = '';
        //url = `http://${process.env.SMORODINA_ACCESS_SERVER_HOST}:${process.env.SMORODINA_ACCESS_SERVER_PORT}/check?session=${session}`
        url = ' https://xn--e1aaobnafwhcg.xn--80ahmohdapg.xn--80asehdb/access/check?session=' + session;
        Logger.log(url);
        const response = await axios.get(url);
        // FUCK
        console.log("SMORODINA_ACCESS_SERVER_HOST: " + response + "\n" + "\t" + response.data.toString());
        const data = response.data;

        if (typeof data === "object") {
            if (data.ok == true) {
                const user = {
                    ...data.result,
                    isSuperuser: data.result.login === "superuser"
                };
                //РЕДИС
                //cache.set(data.result.session, user);
                Redis.setex(session, 3600, JSON.stringify(user));
                return user;
            }
            throw (new Error(data.message));
        }
        throw (new Error("Error occured while user session check"));
    }
}
export default User;