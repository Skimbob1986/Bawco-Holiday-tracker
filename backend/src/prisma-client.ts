import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl.replace(/^"|"$/g, '') }, {});

const prisma = new PrismaClient({ adapter });

// Graceful shutdown: ensure Prisma disconnects on process termination
async function shutdown(signal?: string) {
	try {
		console.log(`
Received ${signal ?? 'shutdown'} - closing Prisma client...`);
		await prisma.$disconnect();
		console.log('Prisma client disconnected');
	} catch (err) {
		console.error('Error during Prisma disconnect', err);
	} finally {
		// allow process to exit
		if (signal) process.exit(0);
	}
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
	console.error('Uncaught exception:', err);
	shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled rejection:', reason);
	shutdown('unhandledRejection');
});

export default prisma;

export { shutdown };
