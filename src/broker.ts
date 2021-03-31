import { start } from 'repl';
import {PositionType, BankUserInputType, CandleType, Loan, ContractOperator} from './interfaces/broker';

const EmptyPosition = (): PositionType => {
    return {
            isOpen: false, 
            currentQty: 0, 
            leverage: 0, 
            liquidationPrice: 0, 
            entry_price: 0,
            timestamp: ""
        }
}


/*

Säljer kontrakt för 10 köper tillbaka för 5
vi har vinst på skillnaden, det kan hända tvärtom


Vi gör olika positions, e
en short
en long
ochkontrollerar summan, summan kontrolleras med 
antigen som ägare av kontrakt eller hyrare.

Om du hyr då är det viktigt att kontorellra att vi alltid kan köpa 
tillbaka dem.


När du ska köpa tillbaka dem, baserat på din positions så är det olika,

ägare; enkelt


hyrare: då måste du kontrollera vinst på short position via entry price, resten av
köp delegeras till ägare (sköts automatiskt genom balance ackumulering)

take profit ska inte behöva göras på sälj av köpta aktier, eftersom vi påverkar balance med dem.

Take profit på shorts, inheritance model för positions.
*/


/*
Jag har en balance, 
jag lånar kontrakt från banken, ni får tillbaka dem sen

*/

const contract_cost = (current_price: number) : number => {
    return 1/current_price         
}


class Wallet {
    btc_balance: number;
    constructor(start_balance: number) {
        this.btc_balance = start_balance
    }

}

class Bank {

    private static _instance: Bank = null;
    private user_loans: Map<string, Loan>    

    public static getInstance() {
        if (this._instance === null) {
            return new Bank()
        }
        return this._instance
    }
    
    public loan(input: BankUserInputType): boolean {
        const {contract_cost, id, contracts, balance } = input

        if (!this.user_loans.has(id)) { this.user_loans.set(id, 0) }
       
        const current_loan        = this.user_loans.get(id)
        const balance_post_paybak = balance - (current_loan * contract_cost)
        const possible: boolean   = balance_post_paybak >= (contracts * contract_cost)
        
        if (possible) { this.user_loans.set(id, current_loan + contracts) } 

        return possible
    }

    public payback(id: string, contracts: number): boolean {
        if (!this.user_loans.has(id)) { return false }
        const current_loan = this.user_loans.get(id)
        this.user_loans.set(id, current_loan - contracts)
        return true
    }


}


export default class Broker {
    short_position: PositionType = EmptyPosition();
    long_position: PositionType = EmptyPosition();
    current_price: number = 0 
    btc_balance: number;
    ID: string = "xid"

    constructor(start_balance: number) {
        this.btc_balance = start_balance
    }

    canbuyback(): boolean {
        return this.btc_balance >= this.short_position.currentQty * contract_cost(this.current_price)
    }

    liquidate() {
        this.btc_balance = 0
        this.short_position = EmptyPosition()
        this.long_position = EmptyPosition()
    }

    tick(price: number) {
        this.current_price = price
        if(!this.canbuyback()) {
            this.liquidate()
        }
    }

    man_wallet(contracts: number, operator: ContractOperator) {   
        this.btc_balance = operator(this.btc_balance, contract_cost(this.current_price) * contracts)
    }

    add_value(contracts: number) {
        this.man_wallet(contracts, (a: number, b: number): number => a + b)
    }

    sub_value(contracts: number) {
        this.man_wallet(contracts, (a: number, b: number): number => a - b)
    }

    // Det här kan generaliseras på båda short och buy
    short(contracts: number) {
        let short_con = contracts
        if(this.long_position.currentQty > 0) {
            const rest = this.long_position.currentQty - contracts
            this.long_position.currentQty = rest < 0 ? 0 : rest
            short_con = Math.abs(Math.min(0, rest))
            const res_con = contracts + rest 
            this.add_value(res_con)
        }
        
        const success = Bank.getInstance()
                            .loan({
                                contracts:  short_con,
                                balance: this.btc_balance,
                                id: this.ID,
                                contract_cost: contract_cost(this.current_price)
                            })

        if (success) 
        {
            this.add_value(short_con)
        }

        return success
    }

    long(contracts: number) {
        let long_con = contracts
        if (this.short_position.currentQty > 0) {
            const rest = this.short_position.currentQty - contracts
            this.short_position.currentQty = rest < 0 ? 0 : rest
            long_con = Math.abs(Math.min(0, rest))
            const res_con = contracts + rest
            const success = Bank.getInstance().payback(this.ID, res_con)

            if (success) {
               this.sub_value(res_con)
            } else {
                return false 
            }
        }

        // Possible to buy with my current balance?
        if(contract_cost(this.current_price) * long_con > this.btc_balance) {
            //Note: we need to rollback the possible if entrance above
            return false
        }
        
        // If possible to buy, alter positions and balance
        this.sub_value(long_con)
        this.long_position.currentQty += long_con


    }



}