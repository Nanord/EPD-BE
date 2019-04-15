import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';
import DataTime from 'node-datetime';


export default new Service({
    name: "ProvidersAcceptedPayments",
    description: "2.Получение отчета по принятым оплатам: 2.1. Список поставщиков услуг, привязанных к Получателю ДС",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { acceptorid, startid, count } = request;
            acceptorid = acceptorid?acceptorid:1;
            startid = startid?startid:1;
            count = count && count < 200?count:200;

            const redis_key = 'methods:3;' + acceptorid + ";" + startid + ";" + count;
            let res = await Redis.get(redis_key);
            res = JSON.parse(res);
            if(!res) {
                /*res = await Sod.performQuery(
                    "123",
                    {
                         reqtype: type || null,
                         acceptorid: acceptorid || null,
                         startid: listpartid || null,
                         count: listcount || null
                    }
                );*/
                res = {
                    reqtype: 2,
                    acceptorid: request.acceptorid,
                    providers: []
                };
                const fakerator = Fakerator();
                for (let i = startid; i < count; i++) {
                    res.providers.push({
                        id: i,
                        name: fakerator.company.name(),
                        provсount: fakerator.random.number(1, 10),
                        summ: fakerator.random.number(100, 10000),
                        debt: fakerator.random.number(10, 100000)
                    });
                }
                Redis.setex(redis_key, JSON.stringify(res));
            }
            if(redis_key) {
                Redis.setex(redis_key, JSON.stringify(res));
            }
            Logger.log("METHOD: " + this.name + ":  res: providers.length = " + res.providers.length);
            return SendSuccess(res);

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});