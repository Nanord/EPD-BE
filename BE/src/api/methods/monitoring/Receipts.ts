import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "Receipt",
    description: "3.Мониторинг принятых оплат 3.4 Запрос части списка квитанций, привязанных к реестру",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let res = await Redis.get('methods:7');
            const { startperiod, endperiod } = request;
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
                    reqtype: 7,
                    listtotal: 2,
                    listpartid: 1,
                    listcount: 2,
                    invoices: [
                        {
                            invid: 1,
                            els: 999,
                            summ: 100000,
                            date: startperiod,
                        },
                        {
                            invid: 2,
                            els: 9999,
                            summ: 1000000,
                            date: endperiod,
                        }
                    ]
                };
                Redis.setex('methods:7', JSON.stringify(res));
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