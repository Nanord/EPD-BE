import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "Receipt",
    description: "3.Мониторинг принятых оплат 3.4 Запрос части списка квитанций, привязанных к реестру",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { id, startid, count } = request;
            startid = startid?startid:1
            count = count?count:200

            let date = new Date();
            let startperiod = date.getDate() + "." + Number(date.getMonth() + 1) + "." + date.getFullYear();
            let endperiod = date.getDate() + "." + Number(date.getMonth() + 1) + "." + date.getFullYear();

            const redis_key = 'methods:7;' + startid + ":" + count;
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
                    reqtype: 7,
                    listtotal: count,
                    listpartid: startid,
                    listcount: count,
                    invoices: []
                };
                const fakerator = Fakerator();
                for (let i = startid; i < count; i++) {
                    res.invoices.push({
                        invid: i,
                        els: fakerator.random.number(100, 10000),
                        summ: fakerator.random.number(100, 10000),
                        date: fakerator.random.number(1,31) + "." + fakerator.random.number(date.getMonth(),date.getMonth() + 1) + "." + date.getFullYear()
                    });
                }
                Redis.setex(redis_key, JSON.stringify(res));
            }
            Logger.log("METHOD: " + this.name + ":  res: invoices.length = " + res.invoices.length);
            res = JSON.stringify(res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});