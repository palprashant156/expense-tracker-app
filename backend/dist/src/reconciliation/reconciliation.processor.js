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
var ReconciliationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const reconciliation_service_1 = require("./reconciliation.service");
const common_1 = require("@nestjs/common");
let ReconciliationProcessor = ReconciliationProcessor_1 = class ReconciliationProcessor extends bullmq_1.WorkerHost {
    reconciliationService;
    logger = new common_1.Logger(ReconciliationProcessor_1.name);
    constructor(reconciliationService) {
        super();
        this.reconciliationService = reconciliationService;
    }
    async process(job) {
        this.logger.log(`Processing job: ${job.name}`);
        if (job.name === 'reconcile-balances') {
            return this.reconciliationService.reconcileBalances();
        }
        return {};
    }
};
exports.ReconciliationProcessor = ReconciliationProcessor;
exports.ReconciliationProcessor = ReconciliationProcessor = ReconciliationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('reconciliation'),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconciliationProcessor);
//# sourceMappingURL=reconciliation.processor.js.map