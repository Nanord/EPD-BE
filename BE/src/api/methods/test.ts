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
            Logger.methods().log(user);
            let res;
            const org = "SM_TEST";
            res = await Redis.get('methods:test');
            if(!res) {
                res = await Sod.performQuery(
                    "AAA_TEST_SELECT_ALL",
                    {
                        // reqtype: request.reqtype || null,
                        // acceptorid: request.acceptorid || null,
                        // listpartid: request.listpartid || null,
                        // listcount: request.listcount || null,
                    }
                );
                /*res = {
                    reqtype: 2,
                    acceptorid: request.acceptorid,
                    providers: [
                        {
                            id: "FUCk",
                            name: "string",
                            summ: "number",
                            fcount: "number",
                        },
                        {
                            id: "number2",
                            name: "string2",
                            summ: "number2",
                            fcount: "number2",
                        }
                    ]
                };*/
                Redis.setex('methods:test', 3600, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.methods().log(this.name + ": \n\t\t\tres:" + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.methods().error(this.name + ": " + error.message + " " + error.err);
            return SendError(100, error.err);
        }
    }
});