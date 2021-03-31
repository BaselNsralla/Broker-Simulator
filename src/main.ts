import Network from './network';
import {Broker, Wallet} from './broker'
import DataDaemon, {CandleType} from './daemon';

//const fastify = require('fastify')({ logger: true })
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
const fastify: FastifyInstance = Fastify({})

const start_server = (broker: Broker, data_daemon: DataDaemon) => {

    data_daemon.start((candle: CandleType) => {
        broker.tick(candle.price_close)
    })

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

    const listen = async () => {
        try {
          await fastify.listen(3000)
        } catch (err) {
          fastify.log.error(err)
          process.exit(1)
        }
    
    }
    
    listen()
}

const main = async function(): Promise<void> 
{
    start_server(new Broker(new Wallet(100)), new DataDaemon('data.json'))
    // const net = Network.Init(['BTC'])
    // const data = await net.tick_data()
    // console.log(data)
}

main()
