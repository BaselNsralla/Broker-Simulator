
import {NetworkConfig} from './interfaces/config'
import {Url} from './url'
import axios from 'axios'

const config: NetworkConfig = require('./config.json')

interface NetworkType {
    tick_data: (symbol: string) => Promise<any>,
}


// Intervalled requests will share interval 1h as common
const tick_data = (url: Url): Promise<any> => {

    url.addParam("interval", "1h,1d")
    url.addSub('currencies', 'ticker')

    const final_url = url.toString()
    
    console.log(final_url)

    return axios.get(final_url)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
        return null
    });    
}

const default_url = (symbols: string[]) => {
    const url = new Url(config.base_url)
    url.addParam('key', config.api_key)
    url.addParam('ids', symbols.join(','))
    return url
}

const Network: any = {
    Init: (symbols: string[]) => {
        const functors = {
            tick_data: () => tick_data(default_url(symbols)),
        }
        return functors
    }  
}

export default Network
