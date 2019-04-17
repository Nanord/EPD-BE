import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';
import DataTime from 'node-datetime';


export default new Service({
    name: "ServicePayments",
    description: "5.Получение отчета принятым и перечисленным оплатам: 5.4. Список услуг, привязанных к Квитанциям",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { id, startid, count } = request;
            id = id?id:1;
            startid = startid?startid:1;
            count = count && count < 200?count:200;

            const redis_key = 'methods:13;' + id  + ";" + startid + ";" + count;
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
                    reqtype: 3,
                    acceptorid: request.acceptorid,
                    services: []
                };
                const fakerator = Fakerator();
                for (let i = startid; i < count; i++) {
                    res.services.push({
                        id: i,
                        name: fakerator.lorem.sentence(),
                        received: fakerator.random.number(100, 10000),
                        listed: fakerator.random.number(0, 10000),
                    });
                }
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