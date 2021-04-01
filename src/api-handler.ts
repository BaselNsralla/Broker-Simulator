import { Broker } from "broker"
import { IncomingMessage, ServerResponse } from "http";
import { ReplyUtils } from "./reply-utils";

export default class ApiHandler {
    private broker: Broker;
    constructor(broker: Broker) {
        this.broker = broker
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
        utils.json(this.broker.position())
    }
}