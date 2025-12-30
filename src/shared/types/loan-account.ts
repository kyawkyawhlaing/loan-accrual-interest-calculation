export type LoanAccount = {
    id: string;
    loanAcctNum: string;
    loanAcctName: string;
    outsPrinAmt: number;
    ccy: string;
    ttlAccIntAmt: number;
    ttlAccPenalAmt: number;
    intRate: number;
    penalRate: number;
}

export class LoanAccountParams {
    searchTerms: string;
    pageNumber = 1;
    pageSize = 10;
    totalCount: number;
    orderBy = 'loanAcctNum';
}
