import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "PayingAgents",
    description: "4.Получение баланса по ЕЛС 4.2 Запрос списка услуг по поставщику для заданного ЕЛС",
    type: 8,
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);
            user.catch(err => {
                return SendError(403, err.message);
            });

            let res = await Redis.get('methods:' + this.type);
            const { els, providerid, listpartid, listcount } = request;
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
                res = {
                    reqtype: this.type,
                    acceptorid: 2,
                    acts: [
                        {
                            id: 1,
                            name: "Кто-то",
                            assumed: 99999,
                            payed: 0
                        },
                        {
                            id: 1,
                            name: "Ещё кто-то",
                            assumed: 999999,
                            payed: 7000
                        }
                    ]
                };
                Redis.setex('methods:' + this.type, JSON.stringify(res));
            }
            res = JSON.stringify(res);
            Logger.methods().log(this.name + ": \n\t\t\t\t\t res: " + res);
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            Logger.methods().error(this.name + ": " + error.message + " " + error.err);
            return SendError(500, error.err);
        }
    }
});