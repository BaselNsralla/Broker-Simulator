import Network from './network';
import {Broker, Wallet} from './broker'
import DataDaemon, {CandleType} from './daemon';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import ApiHandler from './api-handler';
import reply_utils_hook from './reply-utils';
const fastify: FastifyInstance = Fastify({})

const start_server = (data_daemon: DataDaemon) => {

    const wallet = new Wallet(100)
    const broker = new Broker(wallet)

    data_daemon.tick_loop((candle: CandleType, err: Error) => {
        if (err) {
            console.log("Data ticks have ended")
            process.exit()
        }
        console.log("tick: \t", candle.price_close)
        broker.tick(candle.price_close)
    })

    const apiHandler = new ApiHandler(broker, data_daemon)

    fastify.get('/data',      apiHandler.get_market)
    fastify.post('/order',    reply_utils_hook(apiHandler.place_order))
    fastify.get('/positions', reply_utils_hook(apiHandler.get_positions))
    fastify.get('/balance',   async (req:any, res: any) => ({"amount": wallet.balance()}))

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
    start_server(new DataDaemon('data_hour.json', 1000))
    // const net = Network.Init(['BTC'])
    // const data = await net.tick_data()
    // console.log(data)
}

main()
