import NodeCache from 'node-cache-promise';
import axios from 'axios';
import Const from "../Const";

namespace User {
    //РЕДИС
    const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

    export async function check(session: string) {

        if (!session) {
            throw new Error("Incorrect Session");
        }

        if (Const.SMORODINA_MOD_EPD_FAKEID === "true") {
            return require('../../../__debugUserInfo').default;
        }
        //Реализовать через REDIS!
        const user = await cache.get(session);
        if (user) {
            // FUCK
            console.log("4");
            return user;
        }
        const response = await axios.get(`http://${Const.SMORODINA_ACCESS_SERVER_HOST}:${Const.SMORODINA_ACCESS_SERVER_PORT}/check?session=${session}`);
        // FUCK
        console.log("SMORODINA_ACCESS_SERVER_HOST: " + response + "\n" + "\t" + response.data);
        const data = response.data;

        if (typeof data === "object") {
            if (data.ok == true) {
                const user = {
                    ...data.result,
                    isSuperuser: data.result.login === "superuser"
                };
                //РЕДИС
                cache.set(data.result.session, user);
                return user;
            }
            throw (new Error(data.message));
        }
        throw (new Error("Error occured while user session check"));
    }
}
export default User;