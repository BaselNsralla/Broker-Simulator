const fs      = require('fs');

export interface CandleType {
    price_open:        number,
    price_close:       number,
    price_high:        number,
    price_low:         number,
    time_period_start: string
}

type TickCallback = (candle: CandleType, err: Error) => void

export default class DataDaemon {
    data_list: any[]; 
    tick: number; 

    constructor(filename: string) {
        const rawdata = fs.readFileSync(filename);
        this.data_list = JSON.parse(rawdata);
        this.tick = 0
    }

    getAll(): any[] {
        return this.data_list
    }

    getTick(): any {
        if (this.tick > this.data_list.length - 1) { 
            return [null, new Error("End of data")] 
        }
        const data = this.data_list[this.tick]
        this.tick += 1
        return [data, null]
    }

    tick_loop(cb: TickCallback) {
        setInterval(() => {
            const [data, err] = this.getTick()
            cb(data, err)
        }, 3000)
    }
}
