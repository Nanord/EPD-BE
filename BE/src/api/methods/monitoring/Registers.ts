import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';
import DataTime from 'node-datetime';


export default new Service({
    name: "Registers",
    description: "3.Мониторинг принятых оплат 3.3 Запрос части списка реестров за период",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);
        
            let { id, startid, count, startperiod, endperiod } = request;
            id = id?id:1;
            startid = startid?startid:1;

            // Формирование даты
            var end_date = DataTime.create().format('d.m.Y');
            var start_date = end_date.split(".");
            if(Number.parseInt(start_date[1]) > 1) {
                start_date[1] = "0" + (Number.parseInt(start_date[1])-1);
            } else {
                start_date[1] = "31";
            }
            start_date = start_date.join(".");

            //Для тестового вывода
            var m = Number.parseInt(endperiod.split(".")[1])-Number.parseInt(startperiod.split(".")[1]);
            let d = ((Number.parseInt(endperiod.split(".")[0])-Number.parseInt(startperiod.split(".")[0])) +(m > 0?m*30:0));
            count = d>1?d:1;

            let res;
            let redis_key;
            if(!startperiod && !endperiod) {
                endperiod = endperiod ? endperiod : end_date;
                startperiod = startperiod ? startperiod : start_date;
                redis_key = 'methods:6;' + startperiod + ":" + endperiod;
                res = await Redis.get(redis_key);
                res = JSON.parse(res);
            }
            else if(
                startperiod.split(".")[2] == start_date.split(".")[2] &&
                Number.parseInt(startperiod.split(".")[1]) >= Number.parseInt(start_date.split(".")[1]) &&
                Number.parseInt(startperiod.split(".")[0]) >= Number.parseInt(start_date.split(".")[0]) &&
                endperiod.split(".")[2] == end_date.split(".")[2] &&
                Number.parseInt(endperiod.split(".")[1]) <= Number.parseInt(end_date.split(".")[1]) &&
                Number.parseInt(endperiod.split(".")[0]) <= Number.parseInt(end_date.split(".")[0])
            ) {
                redis_key = 'methods:6;' + startperiod + ":" + endperiod;
                res = await Redis.get(redis_key);
                res = JSON.parse(res);
                if(res) {
                    res.registries = res.registries.filter(x => {
                        const sp = startperiod.split(".");
                        const xd = x.date.split(".");
                        if (
                            Number.parseInt(sp[1]) >= Number.parseInt(xd[1]) &&
                            Number.parseInt(sp[0]) >= Number.parseInt(xd[0]) &&
                            Number.parseInt(sp[1]) <= Number.parseInt(xd[1]) &&
                            Number.parseInt(sp[0]) <= Number.parseInt(xd[0])
                        ) {
                            return x
                        }
                    })
                }
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
                    reqtype: 6,
                    listtotal: count,
                    count: count, 
                    registries: []
                };
                for (let i = startid; i < count; i++) {
                    res.registries.push({
                        regid: i,
                        countPayments: 150,
                        startDate:
                            fakerator.random.number(1,31) +
                            "." +
                            Number.parseInt(start_date.split(".")[1]) +
                            "." +
                            start_date.split(".")[2],
                        endDate : 
                            fakerator.random.number(1,31) +
                            "." +
                            Number.parseInt(end_date.split(".")[1]) +
                            "." +
                            start_date.split(".")[2],
                    });
                }
                if(redis_key) {
                    Redis.setex(redis_key, JSON.stringify(res));
                }
            }
            Logger.log("METHOD: " + this.name + ":  res: registries.length = " + res.registries.length);
            return SendSuccess(res);

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});