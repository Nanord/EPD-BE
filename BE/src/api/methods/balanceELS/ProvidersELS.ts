import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "PayingAgents",
    description: "4.Получение баланса по ЕЛС 4.1 Запрос списка поставщиков услуг",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);


            let { els, startperiod, endperiod } = request;
            els = els?els:1;
            let date = new Date();
            startperiod = startperiod ? startperiod :
                date.getDate() + "." + Number(date.getMonth()) + "." + date.getFullYear();
            endperiod = endperiod ? endperiod :
                date.getDate() + "." + Number(date.getMonth() + 1) + "." + date.getFullYear();

            const redis_key = 'methods:8;' + els + ";" + startperiod + ":" + endperiod;
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
                    reqtype: 8,
                    providers: []
                };
                for (let i = 1; i < 11; i++) {
                    res.providers.push({
                        id: i,
                        name: fakerator.company.name(),
                    });
                }
                Redis.setex(redis_key, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("METHOD: " + this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(100, error.err);
        }
    }
});