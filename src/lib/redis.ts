import { Redis } from '@upstash/redis';

const getRedisEnv = () => {
    const redis_url = process.env.REDIS_URL;
    const redis_token = process.env.REDIS_TOKEN;
    if (!redis_url) {
        throw new Error('No Redis URL Provider.');
    }
    if (!redis_token) {
        throw new Error('No Redis Token Provider.');
    }
    return {
        url: redis_url,
        token: redis_token,
    };
};

class RedisSingleton {
    private static instance: Redis | null = null;
    private constructor() {}
    public static getInstance(): Redis {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new Redis({
                url: getRedisEnv().url,
                token: getRedisEnv().token,
            });
        }
        return RedisSingleton.instance;
    }
}

export default RedisSingleton.getInstance();
