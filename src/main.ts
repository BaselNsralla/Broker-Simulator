import Network from './network';

const fs      = require('fs');
const fastify = require('fastify')({ logger: true })

let win  = 0
let lose = 0

class DataProvider {
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




const start_server = (data_provider: DataProvider) => {
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
    start_server(new DataProvider('data.json'))
    // const net = Network.Init(['BTC'])
    // const data = await net.tick_data()
    // console.log(data)
}

main()
