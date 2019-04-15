import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "ServicesELS",
    description: "4.Получение баланса по ЕЛС 4.2 Запрос списка услуг по поставщику для заданного ЕЛС",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { els, providerid, startid, count, startperiod, endperiod } = request;
            els = els?els:1;
            providerid = providerid?providerid:1;
            startid = startid?startid:1;
            count = count?count:200;

            let date = new Date();
            startperiod = startperiod ? startperiod :
                date.getDate() + "." + Number(date.getMonth()) + "." + date.getFullYear();
            endperiod = endperiod ? endperiod :
                date.getDate() + "." + Number(date.getMonth() + 1) + "." + date.getFullYear();

            const redis_key = 'methods:9;' + providerid + ";" + startid + ":" + count;
            let res = await Redis.get(redis_key);
            res = JSON.parse(res);
            if(!res) {
                /*res = await Sod.performQuery(
                    "123",
                    {
                         reqtype: type || null,
                         els: els || null,
                         providerid: providerid || null,
                         startid: listpartidv || null,
                         listcount: listcount || null
                    }
                );*/

                const fakerator = Fakerator();
                res = {
                    reqtype: 9,
                    acceptorid: fakerator.random.number(0,10),
                    acts: []
                };
                for (let i = startid; i < count; i++) {
                    res.acts.push({
                        id: i,
                        name: fakerator.company.name(),
                        assumed: 300000,
                        payed: 0
                    });
                }
                Redis.setex(redis_key, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("METHOD: " + ":  res: acts.length = " + res.acts.length);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("METHOD: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});