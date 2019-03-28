export default function (value: string, f: any) {
    return function (target) {
        if (!target.method) {
            target.method = {};
        }
        target.method[value] = f;
    }
}