import Service from '../../Service';
import Logger from "../../../utils/logger/Logger";
import Sod from "../../../utils/Sod";
import Redis from "../../../utils/Redis";


export default new Service({
    name: "PayingAgents",
    description: "3.Мониторинг принятых оплат 3.1 Запрос списка платежных агентов",
    on: async function (request, checkUser, SendSuccess, SendError) {
        try {
            const user = await checkUser(request.session);

            let res = await Redis.get('methods:4');
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
                Redis.setex('methods:4', JSON.stringify(res));
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