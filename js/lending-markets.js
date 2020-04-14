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

    async function getPairs() {
        try {
            const response = await fetch(`${apiUrl}/lending/pairs`)

            if (response.status !== 200) throw new Error('Server error')

            const { data } = await response.json()

            const pairs = data.reduce((result, item) => {
                return {
                    ...result,
                    [`${item.term}::${item.lendingTokenSymbol}`]: item,
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
            const response = await fetch(`${apiUrl}/lending/market/stats/all`)

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
            const pair = pairs[item.lendingID.name]

            const open = item.open
            const close = item.close
            const change = (close - open)*100/close
            const changeText = (change > 0) ? `+${change.toFixed(2)}` : (change < 0) ? change.toFixed(2) : change
            const price = item.close
            const priceUsd = item.closeBaseUsd
            const volume = (new BigNumber(item.volume).dividedBy(10 ** pair.lendingTokenDecimals)).toString(10)

            const { pricePrecision } = calcPrecision(price)
            const { pricePrecision: priceUsdPrecision } = calcPrecision(priceUsd)

            return {
                term: pair.term,
                lendingTokenSymbol: pair.lendingTokenSymbol,
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

        const rows = data.slice(0, 4).map(item => {
            return `
                <tr>
                    <th scope="row">
                        <a href=${window.location.origin}/trade/${item.term}-${item.lendingTokenSymbol} />
                            <strong>${item.term}</strong> / ${item.lendingTokenSymbol}
                        </a>
                    </th>
                    <td>
                        <span class=${(item.change > 0) ? 'text-green' : (item.change < 0) ? 'text-red' : ''}>${BigNumber(item.price).dividedBy(1e8).toFormat(item.pricePrecision)}%</span>
                    </td>
                    <td><span class=${(item.change > 0) ? 'text-green' : (item.change < 0) ? 'text-red' : ''}>${item.changeText}%</span></td>
                    <td>${BigNumber(item.volume).toFormat(2)} ${item.lendingTokenSymbol}</td>
                </tr>
            `
        })

        return rows.join('')
    }

    async function renderMakets() {
        const { data, error } = await getMaketsStatistic()
        if (error) return

        document.getElementById('number-coins2').innerHTML = `${data.length} coins listed`

        const marketsStatisticParsed = parseMarketsStatistic(data)

        const template = renderMarketsTableRows(marketsStatisticParsed)
    
        document.getElementById('markets-table-body2').innerHTML = template
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
