export type Repayment = {
    Id?: string;
    loanAcctNum: string;
    productCode: string;
    paymentAmt: number;
    ccy: string;
    narrationDetails?: string;
};
