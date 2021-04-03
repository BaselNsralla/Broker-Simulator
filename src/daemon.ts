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
    interval: number

    constructor(filename: string, interval: number) {
        const rawdata = fs.readFileSync(filename);
        this.data_list = JSON.parse(rawdata);
        this.tick = 0
        this.interval = interval
    }

    getPart(count: number): any[] {
        const current_data =  this.data_list.slice(0, this.tick+1)
        return current_data.slice(current_data.length - count)
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
        }, this.interval)
    }
}
