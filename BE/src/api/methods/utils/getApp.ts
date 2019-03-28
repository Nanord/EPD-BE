import checkForVoid from './checkForVoid';
import $ from '../../../utils/DataBase';

export default async function (params) {
    checkForVoid(params, ["appId", "appSecret"])
    /**
     * Получаем приложение по логину паролю
     */
    const app = (await $("AppListSecured", params))[0];

    if (!app)
        throw new Error("Неверные реквизиты приложения");

    return app;
}