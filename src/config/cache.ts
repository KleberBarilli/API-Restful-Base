import { RedisOptions } from 'ioredis';

interface ICacheConfig {
	driver: string;
	config: {
		redis: RedisOptions;
	};
}

export default {
	config: {
		redis: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			pass: process.env.REDIS_PASS || undefined,
		},
	},
	driver: 'redis',
} as ICacheConfig;
