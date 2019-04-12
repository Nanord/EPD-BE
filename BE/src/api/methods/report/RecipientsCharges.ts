import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import User from "../../../utils/User";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "RecipientsCharges",
    description: "1.Получение отчета по начислениям: 1.1. Список получателей",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let res = await Redis.get('methods:1');
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
                    reqtype: 1,
                    accessors: [
                        {
                            id: 1,
                            acceptor: "Борисов",
                            provсount: 1,
                            total: 700,
                            count: 0,
                        },
                        {
                            id: 2,
                            acceptor: "Абрамов",
                            provсount: 1,
                            total: 700,
                            count: 0,
                        }
                    ]
                };
                Redis.setex('methods:1', JSON.stringify(res));
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