import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "PayingAgents",
    description: "3.Мониторинг принятых оплат 3.1 Запрос списка платежных агентов",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { startid, count } = request;
            startid = startid?startid:1
            count = count?count:200

            const redis_key = 'methods:4;' + startid + ":" + count;
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
                res = {
                    reqtype: 4,
                    agents: []
                };
                const fakerator = Fakerator();
                for (let i = startid; i < count; i++) {
                    res.agents.push({
                        id: i,
                        name: fakerator.company.name()
                    });
                }
                Redis.setex(redis_key, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("METHOD: " + this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});