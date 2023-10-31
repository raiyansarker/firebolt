import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { createClient } from '@libsql/client';
import { production } from '$lib/utils';
import { env } from '$env/dynamic/private';
import type { Logger } from 'drizzle-orm';
import chalk from 'chalk';

const connection = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });

class CustomLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		console.log(`${chalk.blueBright("Query")} : ${chalk.greenBright(query)} - ${chalk.yellowBright(params)}`);
	}
}
const db = drizzle(connection, { logger: !production && new CustomLogger(), schema });
export type DbClient = typeof db;

export { db };
