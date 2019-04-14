import Service from '../Service';
import Logger from "../../utils/logger/Logger";
import Redis from "../../utils/Redis";
import Sod from "../../utils/Sod";

export default new Service({
    name: "test",
    description: "test",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.body.session);
            let res;
            const org = "SM_TEST";
            res = await Redis.get('methods:test');
            if(!res) {
                res = await Sod.performQuery(
                    "AAA_TEST_SELECT_ALL",
                    {
                    }
                );
                Redis.setex('methods:test', JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("METHOD: " + this.name + ": \n\t\t\tres:" + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});