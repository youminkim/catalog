import { urlObjectKeys } from 'next/dist/next-server/lib/utils'
const stringify = require('csv-stringify')
const parse = require('csv-parse/lib/sync')

export async function getServerSideProps({ params, req, res, query }) {
    console.log(query)

    const data = await fetch(query.url)
    const text = await data.text()    
    const records = parse(text, {
        columns: true,
        skip_empty_lines: true
    })

    if (records.length == 0) {
        res.write('No records')
        res.end()
        return {
            props: {},
        }
    }

    // currency
    const baseCurrency = 'USD' || records[0].price.split(" ").trim()
    const currencyRate = await (await fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`)).json()

    // change records
    const records_new = records.map((r)=>{
        Object.keys(query).filter((k)=>!['url', 'currency'].includes(k)).map((k)=>{
            r[k] = query[k]
        })

        if (query.currency) {
            const rate = currencyRate.rates[query.currency]            
            const price = parseFloat(r.price.replace(baseCurrency, "").trim())

            // to make the fixed digits 
            r.price = `${(price*rate).toFixed(2)} ${query.currency}`
        }
        return r
    })

    function promiseStringify(data, options) {
        return new Promise((resolve, reject) => {
            stringify(data, options, (err, output) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(output)
                }
            })
        })
    }
    const output = await promiseStringify(
        records_new,
        {
            header: true
        }
    )

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment;filename=catalog_helper.csv`)
    res.write(output)
    res.end()
    return {
        props: {},
    }
}

const Feed = () => null
export default Feed
