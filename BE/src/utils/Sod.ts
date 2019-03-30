import axios from 'axios';

class SOD {
    private endpoint: string;
    private timeout: number;

    constructor(endpoint: string, timeout: number) {
        this.endpoint = endpoint;
        this.timeout = timeout;
    }

    static instance: SOD;
    static getInstance(endpoint: string, timeout: number = 90000) {
        if (!this.instance) {
            this.instance = new SOD(endpoint, timeout);
        }
        return this.instance;
    }

    private jsonEncode(s) {
        let t = "";
        for (let i = 0; i < s.length; i++) {
            let c;
            if (s[i].match(/[^\x00-\x7F]/)) {
                c = "\\u" + ("000" + s[i].charCodeAt(0).toString(16)).substr(-4);
            } else {
                c = s[i];
            }
            t = t + c;
        }
        return t;
    }

    public async query(name: string, org: string | number = -1, params: object = {}, out_params: object = {}, needUnicode: boolean = false) {

        let json = JSON.stringify({ name, org, params, out_params });

        if (needUnicode) {
            json = this.jsonEncode(json);
        }
        const res = await axios({
            method: 'POST',
            url: this.endpoint,
            timeout: this.timeout,
            data: {
                provider: "sodInternal",
                json
            },
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        });

        if (!res.data) {
            throw new Error(`Ошибка работы с СОД: NO DATA`);
        }
        if (res.data.result.code != "1004") {
            throw new Error(`[${res.data.result.code}] ${res.data.result.message}`);
        }

        return res.data.contents;
    }
}


export default SOD.getInstance;