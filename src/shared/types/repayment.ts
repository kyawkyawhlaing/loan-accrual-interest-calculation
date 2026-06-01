export type Repayment = {
    Id?: string;
    loanAcctNum: string;
    loanAcctName: string;
    productCode: string;
    paymentAmt: number;
    ccy: string;
    narrationDetails?: string;
};
