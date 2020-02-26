(function($) {
    "use strict"

    const apiUrl = `${window.location.origin}/api`
    let pairs = []

    function calcPrecision(price) {
        const totalPrecision = 8
        let pricePrecision = 4
        let amountPrecision = totalPrecision - pricePrecision

        if (!price) return {totalPrecision}

        switch (true) {
            case (price >= 50):
                pricePrecision = 2
                amountPrecision = totalPrecision - pricePrecision
                break
            case (price >= 1):
                pricePrecision = 4
                amountPrecision = totalPrecision - pricePrecision
                break
            case (price >= 0.1):
                pricePrecision = 5
                amountPrecision = totalPrecision - pricePrecision
                break
            case (price >= 0.001):
                pricePrecision = 6
                amountPrecision = totalPrecision - pricePrecision
                break
            default:
                pricePrecision = 8
                amountPrecision = totalPrecision - pricePrecision
        }

        return { pricePrecision, amountPrecision }
    }

    function parseAmount(amountpoint, pair, precision = 8) {
        const { baseTokenDecimals } = pair
        const precisionMultiplier = BigNumber(10).pow(precision)
        const baseMultiplier = BigNumber(10).pow(baseTokenDecimals)
        const bigAmount = (BigNumber(amountpoint).times(precisionMultiplier)).div(baseMultiplier)
        const amount = bigAmount.div(precisionMultiplier).toFixed(precision)

        return Number(amount)
    }

    function parsePrice(pricepoint, pair, precision = 8) {
        const { quoteTokenDecimals } = pair
        // We use 18 to avoid result round to 0. 
        const precisionMultiplier = BigNumber(10).pow(18)
        const quoteMultiplier = BigNumber(10).pow(quoteTokenDecimals)
        const bigPricepoint = BigNumber(pricepoint).times(precisionMultiplier)
        const price = ((bigPricepoint.div(quoteMultiplier)).div(precisionMultiplier)).toFixed(precision)
      
        return Number(price)
    }

    async function getPairs() {
        try {
            const response = await fetch(`${apiUrl}/pairs`)

            if (response.status !== 200) throw new Error('Server error')

            const { data } = await response.json()

            const pairs = data.reduce((result, item) => {
                return {
                    ...result,
                    [`${item.baseTokenSymbol}/${item.quoteTokenSymbol}`]: item,
                }
            }, {})

            return { data: pairs, error: null }
        } catch (error) {
            console.error(error)
            return { error }
        }
        
    }

    async function getMaketsStatistic() {
        try {
            const response = await fetch(`${apiUrl}/market/stats/all`)

            if (response.status !== 200) throw new Error('Server error')

            const { data } = await response.json()

            return { data, error: null }
        } catch (error) {
            console.error(error)
            return { error }
        }
    }

    function parseMarketsStatistic(data) {
        return data.map(item => {
            const pair = pairs[item.pair.pairName]

            const open = parsePrice(item.open, pair)
            const close = parsePrice(item.close, pair)
            const change = (close - open)*100/close
            const changeText = (change > 0) ? `+${change.toFixed(2)}` : (change < 0) ? change.toFixed(2) : change
            const price = parsePrice(item.close, pair)
            const priceUsd = item.closeBaseUsd
            const volume = parsePrice(item.volume, pair)

            const { pricePrecision } = calcPrecision(price)
            const { pricePrecision: priceUsdPrecision } = calcPrecision(priceUsd)

            return {
                baseTokenSymbol: pair.baseTokenSymbol,
                quoteTokenSymbol: pair.quoteTokenSymbol,
                change,
                changeText,
                price,
                priceUsd,
                pricePrecision,
                priceUsdPrecision,
                volume,
            }
        })
    }

    function renderMarketsTableRows(data) {
        if (data.lenght === 0) {
            return `
            <tr>
                <td colspan="4" class="text-center">
                    No data
                </td>
            </tr>
            `
        }

        const rows = data.slice(0, 5).map(item => {
            return `
                <tr>
                    <th scope="row">
                        <a href=${window.location.origin}/trade/${item.baseTokenSymbol}-${item.quoteTokenSymbol} />
                            <strong>${item.baseTokenSymbol}</strong> / ${item.quoteTokenSymbol}
                        </a>
                    </th>
                    <td>
                        <span class=${(item.change > 0) ? 'text-green' : (item.change < 0) ? 'text-red' : ''}>${BigNumber(item.price).toFormat(item.pricePrecision)}</span>
                        <samp>$${BigNumber(item.priceUsd).toFormat(item.priceUsdPrecision)}</samp>
                    </td>
                    <td><span class=${(item.change > 0) ? 'text-green' : (item.change < 0) ? 'text-red' : ''}>${item.changeText}%</span></td>
                    <td>${BigNumber(item.volume).toFormat(2)} ${item.quoteTokenSymbol}</td>
                </tr>
            `
        })

        return rows.join('')
    }

    async function renderMakets() {
        const { data, error } = await getMaketsStatistic()
        if (error) return

        document.getElementById('number-coins').innerHTML = `${data.length} coins listed`

        const marketsStatisticParsed = parseMarketsStatistic(data)

        const template = renderMarketsTableRows(marketsStatisticParsed)
    
        document.getElementById('markets-table-body').innerHTML = template
    }

    async function init() {
        const {data, error} = await getPairs()
        if (error) return

        pairs = data

        await renderMakets()

        setInterval(renderMakets, 5000)
    }

    init()
})(jQuery)
