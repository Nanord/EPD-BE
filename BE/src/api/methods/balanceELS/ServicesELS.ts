import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";
import Fakerator from 'fakerator';


export default new Service({
    name: "PayingAgents",
    description: "4.Получение баланса по ЕЛС 4.2 Запрос списка услуг по поставщику для заданного ЕЛС",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let { els, providerid, listpartid, listcount } = request;
            els = els?els:1;
            providerid = providerid?providerid:1;
            listpartid = listpartid?listpartid:1;
            listcount = listcount?listcount:10;

            const redis_key = 'methods:9;' + providerid + ";" + listpartid + ":" + listcount;
            let res = await Redis.get(redis_key);
            res = JSON.parse(res);
            if(!res) {
                /*res = await Sod.performQuery(
                    "123",
                    {
                         reqtype: type || null,
                         els: els || null,
                         providerid: providerid || null,
                         listpartid: listpartidv || null,
                         listcount: listcount || null
                    }
                );*/

                const fakerator = Fakerator();
                res = {
                    reqtype: 9,
                    acceptorid: fakerator.random.number(0,10),
                    acts: []
                };
                for (let i = listpartid; i < listcount; i++) {
                    res.acts.push({
                        id: i,
                        name: fakerator.company.name(),
                        assumed: fakerator.random.number(1, 100),
                        payed: 0
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