import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "PayingAgents",
    description: "3.Мониторинг принятых оплат 3.2 Запрос части списка неподтвержденных квитанций за период",
    type: 5,
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);
            let res = await Redis.get('methods:' + this.type);
            const { startperiod, endperiod } = request;
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
                    reqtype: 4,
                    agents: [
                        {
                            id: 1,
                            name: "СМОРОДИНА",
                        },
                        {
                            id: 2,
                            name: "Нижегородский Государственный Технический Университет",
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