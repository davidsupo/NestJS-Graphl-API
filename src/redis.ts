const promisifyRedis = require('promisify-redis');
const Redis = require('redis');
 
export const redis = promisifyRedis(Redis.createClient());
