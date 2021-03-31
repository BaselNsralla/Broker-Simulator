export interface PositionType {
    isOpen:           boolean,
    currentQty:       number,
    leverage:         number,
    liquidationPrice: number,
    entry_price:      number,
    timestamp:        string,
}

export interface CandleType {
    price_open:        number,
    price_close:       number,
    price_high:        number,
    price_low:         number,
    time_period_start: string
}

export interface BankUserInputType {
    id:        string, 
    contracts: number, 
    contract_cost: number
    balance:   number
}


export type Loan = number
export type ContractOperator = (a: number, b: number) => number