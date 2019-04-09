import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "ProviderListAcceptedPayments",
    description: "2.Получение отчета по принятым оплатам: 2.1. Список поставщиков услуг, привязанных к Получателю ДС",
    type: 3,
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);
            let res = await Redis.get('methods:' + this.type);
            const { acceptorid, startid, count } = request;
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
                    providers: [
                        {
                            id: 1,
                            name: "ЕПД",
                            summ: 400,
                            debt: 100000,
                        },
                        {
                            id: 2,
                            name: "ННГТУ",
                            summ: 7000,
                            debt: 0,
                        }
                    ]
                };
                Redis.setex('methods:' + this.type, 3600, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.methods().log(this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.methods().error(this.name + ": " + error.message + " " + error.err);
            return SendError(100, error.err);
        }
    }
});