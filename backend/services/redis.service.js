import Redis from 'ioredis';


const redisClient = new Redis(process.env.REDIS_URL || `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);


redisClient.on('connect', () => {
    console.log('Redis connected');
})

redisClient.on('error', (err) => {
    console.log('Redis error:', err.message);
})

export default redisClient;