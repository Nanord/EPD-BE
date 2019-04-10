import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "PayingAgents",
    description: "3.Мониторинг принятых оплат 3.2 Запрос части списка неподтвержденных квитанций за период",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let res = await Redis.get('methods:5');
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
                    reqtype: 5,
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
                Redis.setex('methods:5', JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.methods().log(this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.methods().error(this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});