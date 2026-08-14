"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function run() {
    const users = await prisma.user.findMany({ include: { accounts: true } });
    for (const user of users) {
        if (user.accounts.length === 0) {
            await prisma.account.createMany({
                data: [
                    { userId: user.id, name: 'Cash', type: 'cash', balance: 0, currency: 'INR' },
                    { userId: user.id, name: 'Bank Account', type: 'checking', balance: 0, currency: 'INR' },
                ],
            });
            console.log(`Created accounts for ${user.email}`);
        }
    }
    console.log("Done");
}
run();
//# sourceMappingURL=fix_accounts.js.map