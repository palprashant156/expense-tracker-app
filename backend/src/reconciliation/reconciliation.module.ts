import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ReconciliationService } from './reconciliation.service';
import { ReconciliationProcessor } from './reconciliation.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reconciliation',
    }),
  ],
  providers: [ReconciliationService, ReconciliationProcessor],
})
export class ReconciliationModule implements OnModuleInit {
  constructor(@InjectQueue('reconciliation') private reconciliationQueue: Queue) {}

  async onModuleInit() {
    // Schedule the job to run every 6 hours
    await this.reconciliationQueue.add(
      'reconcile-balances',
      {},
      {
        repeat: {
          pattern: '0 */6 * * *', // Every 6 hours
        },
      },
    );
  }
}
