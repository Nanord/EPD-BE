import Service from '../Service';
import Logger from "../../utils/Logger";
import User from "../../utils/User";
import Sod from "../../utils/Sod";
import Redis from "../../utils/Redis";
import Const from "../../Const";


export default new Service({
    name: "ProviderList",
    description: "Список поставщиков услуг, привязанных к Получателю ДС",
    on: async function (request, SendSuccess, SendError) {
        try {
            if(Const.DEBUG) {
                Logger.log("Method:ProviderList, user " + request)
            }
            let user;
            user = Redis.get(request.session);
            if(!user) {
                try {
                    user = await User.check(request.session);
                } catch (error) {
                    return SendError(1000, error.message);
                }
                if (!user.roles.find(role => role.name === "LK_ADMIN") && !user.isSuperuser) {
                    return SendError(1001);
                }
            }

            // @ts-ignore
            // const res = await Sod.performQuery({
            //     reqtype: request.reqtype || null,
            //     acceptorid: request.acceptorid || null
            //     listpartid: request.listpartid || null,
            //     listcount: request.listcount || null,
            // });
            let res;
            res = await Redis.get('methods:2');
            if(!res) {
                res = {
                    reqtype: 2,
                    acceptorid: request.acceptorid,
                    providers: [
                        {
                            id: "number",
                            name: "string",
                            summ: "number",
                            fcount: "number",
                        },
                        {
                            id: "number2",
                            name: "string2",
                            summ: "number2",
                            fcount: "number2",
                        }]
                };
                res = JSON.stringify(res);
                Redis.setex('methods:2', 3600, JSON.stringify(res));
            }
            return SendSuccess(JSON.parse(res));

        } catch (error) {
            return SendError(100, error.err);
        }
    }
});