export interface PositionType {
    isOpen:           boolean,
    currentQty:       number,
    leverage:         number,
    liquidationPrice: number,
    entry_price:      number,
    timestamp:        string,
}

export interface BankUserInput {
    id:        string, 
    contracts: number, 
    contract_cost: number
    balance:   number
}


export type Loan = number
export type ContractOperator = (a: number, b: number) => number