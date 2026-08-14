import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
export declare class ReconciliationModule implements OnModuleInit {
    private reconciliationQueue;
    constructor(reconciliationQueue: Queue);
    onModuleInit(): Promise<void>;
}
