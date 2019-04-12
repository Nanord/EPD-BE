import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "PayingAgents",
    description: "3.Мониторинг принятых оплат 3.3 Запрос части списка реестров за период",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.body.session);

            let res = await Redis.get('methods:6');
            const { startperiod, endperiod } = request.query;
            if(!res) {
                /*res = await Sod.performQuery(
                    "123",
                    {
                         reqtype: type || null,
                         startperiod: startperiod || null,
                         endperiod: endperiod || null
                    }
                );*/
                res = {
                    reqtype: 6,
                    listtotal: 2,
                    listpartid: 1,
                    listcount: 2,
                    registries: [
                        {
                            regid: 1,
                            date: startperiod,
                        },
                        {
                            regid: 2,
                            name: endperiod,
                        }
                    ]
                };
                Redis.setex('methods:6', JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("SERVICE: " + this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("SERVICE: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});