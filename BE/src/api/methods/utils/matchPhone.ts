export const matchPhone = (phone) => {
    return phone.match(/^\+7([\d]{10}$)/);
}

export const splitPhones = (phones = "") => {
    const phonesArray: string[] = [];
    if (!phones) {
        return phonesArray;
    }
    phones.split(",").forEach(phone => {
        if (matchPhone(phone.trim())) {
            phonesArray.push(phone.trim());
        }
    });
    return phonesArray;
}