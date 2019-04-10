import redis, { RedisClient } from 'redis';
import Logger from './logger/Logger';
import {error} from "util";
import {rejects} from "assert";

class Redis {
    static instance: Redis;

    static getInstance() {
        if (!this.instance) {
            this.instance = new Redis();
        }
        return this.instance;
    }

    /**
     * Адрес сервера redis
     */
    //host: string = process.env.SMORODINA_MOD_LKADMIN_REDIS_HOST || "127.0.0.1";
    host: string = "redis";
    port: number = 6379;

    /**
     * Клиент
     */
    client: RedisClient;

    constructor() {
        this.client = redis.createClient({ port: this.port, host: this.host });
        Logger.db().log("Connection to Redis successful!");
        this.client.on("error", (error) => {
            Logger.db().error("Cannot connect to redis server" + error.message);
        });

    }

    /**
     * Подписаться на каналы
     * @param channels список каналов
     * @param message
     */
    public subscribe(channels: string[], message: (channel: string, message: string) => void) {
        const subscribeClient = redis.createClient({ host: this.host });
        subscribeClient.on("error", (error) => {
            Logger.db().error(`Cannot connect to redis server while subscribe [${error.message}]`);
        });
        subscribeClient.on("ready", async () => {
            for (let i = 0; i < channels.length; i++) {
                await subscribeClient.SUBSCRIBE(channels[i]);
            }
        });
        subscribeClient.on("message", message);
    }

    promisify(method: Function, args: any): Promise<any> {
        Logger.db().log("redis.method: " + method.name + " arg: " + Object.values(args));
        return new Promise<any>((resolve, reject) => {
            method.apply(this.client, [... Object.values(args), (err, data) => {
                if (!err) {
                    Logger.db().log(method.name + " successful: " + data);
                    return resolve(data);
                }
                Logger.db().warning(method.name + " unsuccessful");
                return reject(err.message);
            }]);
        }).catch(err=> {
            Logger.db().error("Redis error promise " + err.toString())
        });
    }

    /**
     * Promisified Redis.GET function (Get the value of key)
     * @param key Ключ
     */
    public get(key: string) {
        return this.promisify(this.client.GET, arguments);
    }

    /**
     * Promisified Redis.SET function (Set key to hold the string value)
     * @param key Ключ
     * @param value Значение ключа
     */
    public set(key: string, value: string) {
        return this.promisify(this.client.SET, arguments);
    }

    /**
     * Promisified Redis.SETEX function (Set key to hold the string value and set key to timeout after a given number of seconds)
     * @param key Ключ
     * @param value Значение ключа
     * @param ttl Время жизни ключа (в секундах)
     */
    public setex(key: string, ttl: number, value: string) {
        return this.promisify(this.client.SETEX, arguments);
    }

    /**
     * Promisified Redis.HGETALL function (Returns all fields and values of the hash stored at key)
     * @param key Ключ
     */
    public hgetall(key: string) {
        return this.promisify(this.client.HGETALL, arguments);
    }

    /**
     * Promisified Redis.DEL function (Removes the specified keys)
     * @param key Ключ
     */
    public delete(key: string) {
        return this.promisify(this.client.DEL, arguments);
    }

    public sadd(key: string, ttl: number, value: string) {
        return this.promisify(this.client.SADD, arguments);
    }

    public sismember(key: string, valu: string) {
        return this.promisify(this.client.SISMEMBER, arguments);
    }

    public stop() {
        return this.promisify(this.client.close, arguments);
    }

}

export default Redis.getInstance();