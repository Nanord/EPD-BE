import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import User from "../../../utils/User";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';
import DataTime from 'node-datetime';


export default new Service({
    name: "RecipientsCharges",
    description: "1.Получение отчета по начислениям: 1.1. Список получателей",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { startperiod, endperiod, startid, count } = request;
            startid = startid?startid:1;
            count = count && count < 150?count:150;

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
                redis_key = 'methods:1;' + startperiod + ":" + endperiod;
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
                    reqtype: 1,
                    accessors: []
                };
                for (let i = startid; i < count; i++) {
                    res.accessors.push({
                        id: i,
                        acceptor: fakerator.names.name(),
                        provсount: fakerator.random.number(1, 10),
                        total: fakerator.random.number(100, 10000),
                        count: fakerator.random.number(10, 100)
                    });
                }
                if(redis_key) {
                    Redis.setex(redis_key, JSON.stringify(res));
                }
            }

            Logger.log("METHOD: " + this.name + ":  res: accessors.length = " + res.accessors.length);
            return SendSuccess(res);

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});