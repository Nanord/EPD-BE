import Errors from './Errors';
interface Service {
    on: Function
    name: string
    description: string
}

class Service {

    constructor(opt: { name: string, description?: string, on: Function }) {
        this.name = opt.name;
        if (opt.description) {
            this.description = opt.description;
        }
        this.on = opt.on;
    }

    name = "Unknown";
    description = "";

    executor(req: any, res: any) {
        /**
         * Для безопастного выполнения
         * сервиса без ответа
         */
        if (typeof res !== 'function') {
            res = () => { };
        }

        /**
         * Ошибка с кодом 2 если нет запроса
         */
        if (!req) {
            return SendError.bind(this)(2);
        }

        /**
         * Обратная совместимость для старых версий
         */
        if (!req.version) {
            req.version = 1;
        }

        /**
         * Вернуть ответ API
         */
        function SendSuccess(result: any = null): void {
            this({ ok: true, code: 0, message: "OK", result });
        }

        /**
         * Вернуть ошибку
         */
        function SendError(code: number = 1, message: string = ""): void {
            const msg = message || (Errors[code] ? Errors[code].message : "Ошибка");

            this({ ok: false, code, message: msg, result: null });
        }

        /**
         * res - pipe функция в которую нужно передать результат
         * делаем bind для SendSuccess и SendError на pipe res
         * для того чтобы они могли передать ответ
         */
        return this.on.bind(this)(req, SendSuccess.bind(res), SendError.bind(res));
    }

    /**
     * Выполнить сервис
     * Отдельная функция для выполнения сервиса
     */
    exec(params: any) {
        return new Promise((SendSuccess, SendError) => {
            this.on.bind(this)(params, SendSuccess, (code: number, message?: string) => {
                const msg = message || (Errors[code] ? Errors[code].message : "Ошибка");
                SendError({
                    code: code,
                    message: msg
                });
            }, true);
        });
    }
}

export default Service;