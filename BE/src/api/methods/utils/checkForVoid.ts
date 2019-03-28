export default function (params, checkValues) {
    checkValues.forEach(key => {
        if (!params[key])
            throw new Error(`Параметр ${key} должен быть заполнен`);
    });
    return true;
}
