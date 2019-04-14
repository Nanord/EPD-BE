import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "ProviderListCharges",
    description: "1.Получение отчета по начислениям: 1.2. Список поставщиков услуг, привязанных к Получателю ДС",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { acceptorid, listpartid, listcount } = request;
            acceptorid = acceptorid?acceptorid:1;
            listpartid = listpartid?listpartid:1;
            listcount = listcount?listcount:10;
            const redis_key = 'methods:2;' + acceptorid + ";" + listpartid + ";" + listcount;
            let res = await Redis.get(redis_key);
            res = JSON.parse(res);
            if(!res) {
                /*res = await Sod.performQuery(
                    "123",
                    {
                         reqtype: type || null,
                         acceptorid: acceptorid || null,
                         listpartid: listpartid || null,
                         listcount: listcount || null
                    }
                );*/
                res = {
                    reqtype: 2,
                    acceptorid: request.acceptorid,
                    providers: []
                };
                const fakerator = Fakerator();
                for (let i = listpartid; i < listcount; i++) {
                    res.providers.push({
                        id: i,
                        name: fakerator.company.name(),
                        summ: fakerator.random.number(100, 10000),
                        fcount: fakerator.random.number(10, 100)
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