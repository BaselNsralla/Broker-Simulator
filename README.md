# Broker Simulator for Exemplarius

Sandbox for long, short, and position management 

---

### Setup
Add your api_key to the `config.json` file inside the `src` folder

* Create the file in the following format:

```json
{
    "api_key": "ABCDEFGHI...221321",
    "base_url": "https://api.nomics.com/v1/"
}
```

You also need a datafile in case you are running on older data, [which the current version does], I use the coin_api.io data, the key names might be too hardcoded right now. The current data format is 

```json
[
    {
     "time_period_start": "2018-01-01T00:00:00.0000000Z", 
     "time_period_end": "2018-01-01T00:30:00.0000000Z", 
     "time_open": "2018-01-01T00:00:03.0000000Z", 
     "time_close": "2018-01-01T00:29:44.0000000Z", 
     "price_open": 13880.0, 
     "price_high": 13906.37, 
     "price_low": 13631.95, 
     "price_close": 13726.16, 
     "volume_traded": 183.973077699 
    }, 
    ...
]
```

### Installation
`npm install -g ts-node ts tsc nodemon`

`npm install`

### Run
`npm run start`





