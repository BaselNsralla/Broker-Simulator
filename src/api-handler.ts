import { Broker } from "broker"
import DataDaemon from "./daemon";
import { IncomingMessage, request, ServerResponse } from "http";
import { ReplyUtils } from "./reply-utils";

export default class ApiHandler {
    private broker: Broker;
    private data_daemon: DataDaemon;

    constructor(broker: Broker, daemon: DataDaemon) {
        this.broker = broker
        this.data_daemon = daemon
    }

    get_market = async (request: any, reply: any) => {
        const count = request.query.count
        if (!count) {
            return this.data_daemon.getAll()
        }
        switch (request.query.candle_range) {
            case "1m": 
                return this.data_daemon.getPart(request.query.count)   
            default:
                console.log("Unknown candle range")
                throw new Error("Unknown candle range")
        }
    }

    place_order = async (utils: ReplyUtils, request: any, reply: any) => {//(request: IncomingMessage, reply: ServerResponse) {
        const quantity = request.body.quantity
        const action = (quantity > 0) ? this.broker.long :  this.broker.short // or if we omit arrow member function we do (data:number) => this.broker.short(data) 
        const result = action(Math.abs(quantity))
        
        if (!result) {
            utils.json_code(400, {message: "Order could not be executed completely: Insufficient balance"})
        } else {
            utils.json({message: "Order has been placed"})
        }
    }

    get_positions = async (utils: ReplyUtils, request: any, reply: any) => {
        utils.json([this.broker.position()])
    }

}