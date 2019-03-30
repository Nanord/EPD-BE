import Service from '../Service';

export default new Service({
    name: "test",
    description: "test",
    on: async (request, SendSuccess) => {

        const filters = { request };

        const data = {
            test:"fuck"
        };
        SendSuccess(data);
    }
});