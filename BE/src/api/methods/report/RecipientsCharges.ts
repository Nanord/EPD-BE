import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import User from "../../../utils/User";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "RecipientsCharges",
    description: "1.Получение отчета по начислениям: 1.1. Список получателей",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { startperiod, endperiod } = request;
            let date = new Date();
            startperiod = startperiod ? startperiod :
                date.getDate() + "." + Number(date.getMonth()) + "." + date.getFullYear();
            endperiod = endperiod  ? endperiod :
                date.getDate() + "." + Number(date.getMonth() + 1) + "." + date.getFullYear();

            const redis_key = 'methods:1;' + startperiod + ":" + endperiod;
            let res = await Redis.get(redis_key);
            res = JSON.parse(res);
            if(!res) {
                /*res = await Sod.performQuery(
                    "123",
                    {
                         reqtype: type || null,
                         startperiod: startperiod || null,
                         endperiod: endperiod || null
                    }
                );*/
                const fakerator = Fakerator();
                res = {
                    reqtype: 1,
                    accessors: []
                };
                for (let i = 1; i < 11; i++) {
                    res.accessors.push({
                        id: i,
                        acceptor: fakerator.names.name(),
                        provсount: fakerator.random.number(1, 10),
                        total: fakerator.random.number(100, 10000),
                        count: fakerator.random.number(10, 100)
                    });
                }
                Redis.setex(redis_key, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("METHOD: " + this.name + ":  res: accessors.length = " + res.accessors.length);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});