import Network from './network';
import {Broker, Wallet} from './broker'

const fs      = require('fs');
const fastify = require('fastify')({ logger: true })

class DataDaemon {
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
}

const start_server = (broker: Broker, data_daemon: DataDaemon) => {

    fastify.get('/data', async (request: any, reply: any) => {
        return { hello: 'world' }  
    })

    // keep track of these by a Broker class
    fastify.get('/place', async (request: any, reply: any) => {
        return { hello: 'world' }  
    })

    //Position(element['isOpen'], element['currentQty'], 0, 0, element['timestamp'])
    fastify.get('/positions', async (request: any, reply: any) => {
        return { hello: 'world' }  
    })

    (async () => {
        try {
          await fastify.listen(3000)
        } catch (err) {
          fastify.log.error(err)
          process.exit(1)
        }
    
    })()
}

const main = async function(): Promise<void> 
{
    start_server(new Broker(new Wallet(100)), new DataDaemon('data.json'))
    // const net = Network.Init(['BTC'])
    // const data = await net.tick_data()
    // console.log(data)
}

main()
