import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "PayingAgents",
    description: "3.Мониторинг принятых оплат 3.3 Запрос части списка реестров за период",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { startperiod, endperiod } = request;
            let date = new Date();
            startperiod = startperiod ? startperiod :
                date.getDate() + "." + Number(date.getMonth()) + "." + date.getFullYear();
            endperiod = endperiod ? endperiod :
                date.getDate() + "." + Number(date.getMonth() + 1) + "." + date.getFullYear();

            const redis_key = 'methods:6;' + startperiod + ":" + endperiod;
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
                    reqtype: 6,
                    listtotal: 10,
                    listpartid: 1,
                    listcount: 11,
                    registries: []
                };
                for (let i = 1; i < 10; i++) {
                    res.registries.push({
                        regid: i,
                        date: fakerator.random.number(1,31) + "." + fakerator.random.number(date.getMonth(),date.getMonth() + 1) + "." +  date.getFullYear()
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