import Service from '../Service';

export default new Service({
    name: "summaryGeneralCharts",
    on: async (request, SendSuccess) => {

        const filters = { request };

        const data = [
            {
                title: "Выпущено ЕПД",
                values: [540941, 650242, 1040329],
                labels: ["Январь", "Февраль", "Март"],
            },
            {
                title: "Начислено, ₽",
                values: [425910122113, 51339443402, 1149384755433],
                labels: ["Январь", "Февраль", "Март"],
            },
            {
                title: "Количество платежей",
                values: [40242, 45242, 58103],
                labels: ["Январь", "Февраль", "Март"],
            },
            {
                title: "Сумма платежей, ₽",
                values: [402942, 452923, 634123],
                labels: ["Январь", "Февраль", "Март"],
            }
        ];
        SendSuccess(data);
    }
});