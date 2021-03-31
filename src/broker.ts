
import {PositionType, BankUserInput, CandleType, Loan, ContractOperator} from './interfaces/broker-interfaces';

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

const contract_cost = (current_price: number) : number => {
    return 1/current_price         
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
    
    public loan(input: BankUserInput): boolean {
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

export class Wallet {
    private btc_balance: number;

    constructor(start_balance: number) {
        this.btc_balance = start_balance
    }

    private man_wallet(contracts: number, current_price: number, operator: ContractOperator) {   
        this.btc_balance = operator(this.btc_balance, contract_cost(current_price) * contracts)
    }

    add_value(contracts: number, current_price: number) {
        this.man_wallet(contracts, current_price, (a: number, b: number): number => a + b)
    }

    sub_value(contracts: number, current_price: number) {
        this.man_wallet(contracts, current_price, (a: number, b: number): number => a - b)
    }

    balance(): number {
        return this.btc_balance
    }

    reset() {
        this.btc_balance = 0
    }

}



export class Broker {
    short_position: PositionType = EmptyPosition();
    long_position: PositionType = EmptyPosition();
    current_price: number = 0 
    private wallet: Wallet;
    ID: string = "xid"

    constructor(wallet: Wallet) {
        this.wallet = wallet
    }

    canbuyback(): boolean {
        return this.wallet.balance() >= this.short_position.currentQty * contract_cost(this.current_price)
    }

    liquidate() {
        this.wallet.reset()
        this.short_position = EmptyPosition()
        this.long_position = EmptyPosition()
    }

    tick(price: number) {
        this.current_price = price
        if(!this.canbuyback()) {
            this.liquidate()
        }
    }

    private man_opposite_pos(position: PositionType, contracts: number) {
        const rest = position.currentQty - contracts
        position.currentQty = rest < 0 ? 0 : rest
        const post_con = Math.abs(Math.min(0, rest))
        const pre_con = contracts + rest
        return [pre_con, post_con]
    }

    // Det här kan generaliseras på båda short och buy
    short(contracts: number) {
        let short_contracts = contracts
        if(this.long_position.currentQty > 0) {
            const [pre_short, post_short] = this.man_opposite_pos(this.long_position, contracts)
            short_contracts = post_short
            this.wallet.add_value(pre_short, this.current_price)
        }
        
        const success = Bank.getInstance()
                            .loan({
                                contracts:  short_contracts,
                                balance: this.wallet.balance(),
                                id: this.ID,
                                contract_cost: contract_cost(this.current_price)
                            })

        if (success) 
        {
            this.wallet.add_value(short_contracts, this.current_price)
        }

        return success
    }

    long(contracts: number) {
        let long_contracts = contracts
        if (this.short_position.currentQty > 0) {
            const [pre_long, post_long] = this.man_opposite_pos(this.short_position, contracts)
            long_contracts = post_long
            const success = Bank.getInstance().payback(this.ID, pre_long)
            if (success) {
                this.wallet.sub_value(pre_long, this.current_price)
            } else {
                return false 
            }
        }

        // Possible to buy with my current balance?
        if(contract_cost(this.current_price) * long_contracts > this.wallet.balance()) {
            //Note: we need to rollback the possible if entrance above
            return false
        }
        
        // If possible to buy, alter positions and balance
        this.wallet.sub_value(long_contracts, this.current_price)
        this.long_position.currentQty += long_contracts


    }



}