import { AccountsService } from './accounts.service';
import { JwtService } from '@nestjs/jwt';
export declare class AccountsController {
    private readonly accountsService;
    private readonly jwtService;
    constructor(accountsService: AccountsService, jwtService: JwtService);
    private getUserId;
    getAccounts(req: any): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: string;
        balance: bigint;
        isArchived: boolean;
        lastReconciledAt: Date | null;
    }[]>;
    createAccount(req: any, body: any): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: string;
        balance: bigint;
        isArchived: boolean;
        lastReconciledAt: Date | null;
    }>;
}
