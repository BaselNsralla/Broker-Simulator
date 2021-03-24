import Network from './network';

const main = async function(): Promise<void> 
{
    const net = Network.Init(['BTC'])
    const data = await net.tick_data()
    console.log(data)
}

main()
