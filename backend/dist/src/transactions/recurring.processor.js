"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RecurringTransactionsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringTransactionsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RecurringTransactionsProcessor = RecurringTransactionsProcessor_1 = class RecurringTransactionsProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(RecurringTransactionsProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        this.logger.log('Running recurring transactions check...');
        const pendingRecurring = await this.prisma.$queryRaw `
      SELECT * FROM recurring_transactions 
      WHERE is_active = TRUE AND next_date <= CURRENT_TIMESTAMP
    `;
        const tasks = pendingRecurring;
        if (tasks.length === 0) {
            this.logger.log('No pending recurring transactions found.');
            return { processed: 0 };
        }
        this.logger.log(`Found ${tasks.length} recurring transactions to process.`);
        return { processed: tasks.length };
    }
};
exports.RecurringTransactionsProcessor = RecurringTransactionsProcessor;
exports.RecurringTransactionsProcessor = RecurringTransactionsProcessor = RecurringTransactionsProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('recurring-transactions'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecurringTransactionsProcessor);
//# sourceMappingURL=recurring.processor.js.map