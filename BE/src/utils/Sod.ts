import axios from 'axios';
import Logger from './logger/Logger';

class Sod {
    static instance: Sod;

    static getInstance() {
        if (Sod.instance == null) {
            Sod.instance = new Sod();
        }
        return Sod.instance;
    }

    constructor() { }

    private jsonEncode(s) {
        let ret = "";
        for (let i = 0; i < s.length; i++) {
            let chr;
            if (s[i].match(/[^\x00-\x7F]/)) {
                chr = "\\u" + ("000" + s[i].charCodeAt(0).toString(16)).substr(-4);
            } else {
                chr = s[i];
            }
            ret = ret + chr;
        }
        return ret;
    }


    /**
     * Выполнить запрос в СОД
     * @param name
     * @param {Object} params
     * @param {Object} out_params
     * @param needUnicode
     */
    public performQuery(name: string, params = {}, out_params = {}, needUnicode = false): Promise<any> {
        const org = "SM_TEST";
        const sodid = -1;
            if (typeof params === 'undefined' || typeof name === 'undefined') {
            throw ("Параметры функции должны быть опеределены");
        }
        const requestObject = { name, org, params, out_params };
        Logger.sod().log("req: " + requestObject.name);
        let json = JSON.stringify(requestObject);
        if (needUnicode) {
            json = this.jsonEncode(json);
        }
        const url = process.env.SMORODINA_SOD_SERVER_HOST;

        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url,
                timeout: 90000,
                data: {
                    provider: "sodInternal",
                    json
                },
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then(res => {
                if (!res.data) {
                    reject({
                        message: "Ошибка работы с СОД",
                        err: 'Отсутствует информация!'
                    });
                    return;
                }
                if (res.data.result.code == "1004") {
                    resolve(res.data.contents as any[]);
                } else {
                    Logger.sod().error(`SOD !! (${res.data.result.code}) ${res.data.result.message}`);
                    reject({
                        err: res.data.result.message,
                        message: "Ошибка работы с СОД"
                    });
                }
            }).catch((error) => {
                //@ts-ignore
                if (error.message) {
                    Logger.sod().error(`!!${error.message}`);
                }
                else {
                    Logger.sod().error(`!!${error.toString()}`);
                }
                reject({
                    err: error.message,
                    message: "Ошибка работы СОД"
                });
            });
        });
    }

}

export default Sod.getInstance();