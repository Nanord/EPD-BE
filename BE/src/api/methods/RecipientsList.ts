import Service from '../Service';
import Logger from "../../utils/Logger";
import User from "../../utils/User";
import Sod from "../../utils/Sod";
import Redis from "../../utils/Redis";


export default new Service({
    name: "RecipientsList",
    description: "Список получателей",
    on: async function (request, SendSuccess, SendError) {
        try {
            Logger.log("Method: " + this.name + ", user " + request.session);
            let user;
            try {
                user = await User.check(request.session);
                Logger.log("user checked");
            } catch (error) {
                Logger.log("user unchecked");
                return SendError(1000, error.message);
            }
            if (!user.roles.find(role => role.name === "LK_ADMIN") && !user.isSuperuser) {
                return SendError(1001);
            }
            // @ts-ignore
            // const res = await Sod.performQuery({
            //     reqtype: request.reqtype || null,
            //     startperiod: request.startperiod || null,
            //     endperiod: request.endperiod || null,
            // });
            let res;
            res = await Redis.get('methods:1');
            if(!res) {
                res = {
                    reqtype: 1,
                    accessors: [
                        {
                            id: "number",
                            acceptor: "string",
                            provсount: "number",
                            total: "number",
                            count: "number"
                        },
                        {
                            id: "number2",
                            acceptor: "string2",
                            provсount: "number2",
                            total: "number2",
                            count: "number2"
                        }]
                };
                res = JSON.stringify(res);
                Redis.setex('methods:1', 3600, JSON.stringify(res));
            }
            if(process.env.DEBUG) {
                Logger.log("Method:ProviderList, user " + request.session)
            }
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            return SendError(100, error.err);
        }
    }
});