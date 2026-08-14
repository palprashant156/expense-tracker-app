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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const reconciliation_service_1 = require("./reconciliation.service");
const reconciliation_processor_1 = require("./reconciliation.processor");
let ReconciliationModule = class ReconciliationModule {
    reconciliationQueue;
    constructor(reconciliationQueue) {
        this.reconciliationQueue = reconciliationQueue;
    }
    async onModuleInit() {
        await this.reconciliationQueue.add('reconcile-balances', {}, {
            repeat: {
                pattern: '0 */6 * * *',
            },
        });
    }
};
exports.ReconciliationModule = ReconciliationModule;
exports.ReconciliationModule = ReconciliationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'reconciliation',
            }),
        ],
        providers: [reconciliation_service_1.ReconciliationService, reconciliation_processor_1.ReconciliationProcessor],
    }),
    __param(0, (0, bullmq_1.InjectQueue)('reconciliation')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], ReconciliationModule);
//# sourceMappingURL=reconciliation.module.js.map