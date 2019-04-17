import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';
import DataTime from 'node-datetime';


export default new Service({
    name: "ReceiptsPayments",
    description: "5.Получение отчета принятым и перечисленным оплатам 5.2 Запрос списка квитанций привязанных к Платежным Агентам",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { id, startid, count, startperiod, endperiod } = request;
            id = id?id:1;
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
                redis_key = 'methods:11;' + startperiod + ":" + endperiod;
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
                redis_key = 'methods:11;' + startperiod + ":" + endperiod;
                res = await Redis.get(redis_key);
                res = JSON.parse(res);
                if(res) {
                    res.invoices = res.invoices.filter(x => {
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
                res = {
                    reqtype: 7,
                    listtotal: count,
                    invoices: []
                };
                const fakerator = Fakerator();
                for (let i = startid; i < count; i++) {
                    res.invoices.push({
                        id: i,
                        received: fakerator.random.number(100, 10000),
                        listed: fakerator.random.number(0, 10000),
                        idpp: fakerator.random.number(1111, 9999),
                        regid: fakerator.random.number(1, 150),
                        date:
                            fakerator.random.number(1,31) +
                            "." +
                            fakerator.random.number(Number.parseInt(start_date.split(".")[1]), Number.parseInt(end_date.split(".")[1])) +
                            "." +
                            start_date.split(".")[2]
                    });
                }
                if(redis_key) {
                    Redis.setex(redis_key, JSON.stringify(res));
                }
            }
            Logger.log("METHOD: " + this.name + ":  res: invoices.length = " + res.invoices.length);
            return SendSuccess(res);

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});