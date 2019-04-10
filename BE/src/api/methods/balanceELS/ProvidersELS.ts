import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "PayingAgents",
    description: "4.Получение баланса по ЕЛС 4.1 Запрос списка поставщиков услуг",
    type: 7,
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);
            user.catch(err => {
                return SendError(403, err.message);
            });

            let res = await Redis.get('methods:' + this.type);
            const { els, startperiod, endperiod } = request;
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
                    reqtype: this.type,
                    providers: [
                        {
                            id: 1,
                            name: "Кто-то",
                        },
                        {
                            id: 1,
                            name: "Еще кто-то"
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
            return SendError(100, error.err);
        }
    }
});