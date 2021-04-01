import { Broker } from "broker"
import { IncomingMessage, ServerResponse } from "http";



export default class ApiHandler {
    private broker: Broker;
    constructor(broker: Broker) {
        this.broker = broker
    }

    async place_order(request: any, reply: any) {//(request: IncomingMessage, reply: ServerResponse) {

        const quantity = request.body.quantity
        
        const action = (quantity > 0) ? this.broker.long : this.broker.short 
        const result = action(Math.abs(quantity))
        return Promise.resolve(result)
    }


}