import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "ProviderListCharges",
    description: "1.Получение отчета по начислениям: 1.2. Список поставщиков услуг, привязанных к Получателю ДС",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let res = await Redis.get('methods:2');
            const { acceptorid, listpartid, listcount } = request;
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
                    providers: [
                        {
                            id: 1,
                            name: "ЕПД",
                            summ: 400,
                            fcount: 0,
                        },
                        {
                            id: "2",
                            name: "ННГТУ",
                            summ: 0,
                            fcount: 0,
                        }
                    ]
                };
                Redis.setex('methods:2', JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.log("SERVICE: " + this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.error("SERVICE: " + this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});