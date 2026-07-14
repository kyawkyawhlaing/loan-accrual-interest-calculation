export type AuditLog = {
    id: string;
    userId: string;
    userName: string;
    action: string;
    description?: string;
    loanAccountNumber?: string;
    occurredAt: string;
};

export class AuditLogParams {
    date: string | null = null;
    pageNumber = 1;
    pageSize = 10;
    totalCount = 0;
}
