import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';
import DataTime from 'node-datetime';


export default new Service({
    name: "ProvidersELS",
    description: "4.Получение баланса по ЕЛС 4.1 Запрос списка поставщиков услуг",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);


            let { els, startperiod, endperiod, startid, count } = request;
            els = els?els:1;
            startid = startid?startid:1;
            count = count && count < 200?count:200;

            // Формирование даты
            var end_date = DataTime.create().format('d.m.Y');
            var start_date = end_date.split(".");
            if(Number.parseInt(start_date[1]) > 1) {
                start_date[1] = "0" + (Number.parseInt(start_date[1])-1);
            } else {
                start_date[1] = "31";
            }
            start_date = start_date.join(".");

            let res;
            let redis_key;
            if(!startperiod && !endperiod) {
                endperiod = endperiod ? endperiod : end_date;
                startperiod = startperiod ? startperiod : start_date;
                redis_key = 'methods:8;' + els + ";" + startperiod + ":" + endperiod;
                res = await Redis.get(redis_key);
                res = JSON.parse(res);
            }
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
                for (let i = startid; i < count; i++) {
                    res.providers.push({
                        id: i,
                        name: fakerator.company.name(),
                    });
                }
                if(redis_key) {
                    Redis.setex(redis_key, JSON.stringify(res));
                }
            }
            Logger.log("METHOD: " + this.name + ":  res: providers.length = " + res.providers.length);
            return SendSuccess(res);
        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(100, error.err);
        }
    }
});