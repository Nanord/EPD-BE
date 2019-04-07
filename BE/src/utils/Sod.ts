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
     * @param {Object} params
     * @param {Object} out_params
     */
    public performQuery(params = {}, out_params = {}, needUnicode = false): Promise<any> {
        const name = "хз";
        const org = -1;
            if (typeof params === 'undefined' || typeof name === 'undefined') {
            throw ("Параметры функции должны быть опеределены");
        }
        const requestObject = { name, org, params, out_params };
        let json = JSON.stringify(requestObject);
        if (needUnicode) {
            json = this.jsonEncode(json);
        }

        //@ts-ignore
        //const url = `http://${process.env.SMORODINA_SOD_SERVER_HOST}:${process.env.SMORODINA_SOD_SERVER_PORT}/${process.env.SMORODINA_SOD_SERVER_PATH}`;
        const url = `http://172.16.200.191:8077/SOD`;

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
                    Logger.error(`SOD !! (${res.data.result.code}) ${res.data.result.message}`);
                    reject({
                        err: res.data.result.message,
                        message: "Ошибка работы с СОД"
                    });
                }
            }).catch((error) => {
                //@ts-ignore
                if (error.message) {
                    Logger.error(`SOD !! ${error.message}`);
                }
                else {
                    Logger.error(`SOD !! ${error.toString()}`);
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