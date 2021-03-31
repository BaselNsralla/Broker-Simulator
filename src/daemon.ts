const fs      = require('fs');

export interface CandleType {
    price_open:        number,
    price_close:       number,
    price_high:        number,
    price_low:         number,
    time_period_start: string
}

export default class DataDaemon {
    data_list: any[]; 
    tick: number; 

    constructor(filename: string) {
        const rawdata = fs.readFileSync(filename);
        this.data_list = JSON.parse(rawdata);
        this.tick = 0
    }

    getTick(): any {
        const data = this.data_list[this.tick]
        this.tick += 1
        return data
    }

    start(cb: (candle: CandleType) => void) {
        setInterval(() => {
            cb(this.getTick())
        }, 3000)
    }
}
