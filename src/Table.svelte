<script>
    import {
        totalMarketCap,
        predictedMarketCap,
        formatMarketCap,
    } from "./stores/totalMarketCap.js";
    export let coin;

    $: coin.marketDominance = (
        (coin.marketCap / $totalMarketCap) *
        100
    ).toPrecision(2);

    const formatNumber = (number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(number);

    let marketDominanceSteps = [
        { id: 1, multiplier: 0.5 },
        { id: 2, multiplier: 0.75 },
        { id: 3, multiplier: 1 },
        { id: 4, multiplier: 1.25 },
        { id: 5, multiplier: 1.5 },
    ];
    let marketCapSteps = [
        $predictedMarketCap.lower,
        $predictedMarketCap.middle,
        $predictedMarketCap.upper,
    ];

    export function calulatePredictedMarketDominance(
        currentDominance,
        multiplier
    ) {
        return currentDominance * multiplier;
    }

    export function calulatePredictedMarketCap(currentMarketCap, multiplier) {
        return (multiplier / 100) * currentMarketCap;
    }

    export function calculatePrice(marketCap, circulatingSupply) {
        return marketCap / circulatingSupply;
    }

    export function calculatePredictedPrice(
        coin,
        marketDominanceMultiplier,
        marketCap
    ) {
        let predictedMarketDominance = calulatePredictedMarketDominance(
            coin.marketDominance,
            marketDominanceMultiplier
        );
        let predictedMarketCap = calulatePredictedMarketCap(
            marketCap,
            predictedMarketDominance
        );
        let predictedPrice = calculatePrice(
            predictedMarketCap,
            coin.circulatingSupply
        );
        return {
            price: predictedPrice,
            predictedMarketDominance: predictedMarketDominance,
            predictedMarketCap: predictedMarketCap,
        };
    }
</script>

<table>
    <thead>
        <tr>
            <th>
                <span class="text-small">Potential Dominance</span>
            </th>
            <th colspan="3">
                <span class="text-small">Potential Crypto Market Cap</span>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td />
            {#each marketCapSteps as mcs, i}
                <td>
                    {`${formatMarketCap(mcs)}`}
                    {#if i === 0}
                        <span class="text-small">Bearish</span>
                    {:else if i === 2}
                        <span class="text-small">Bullish</span>
                    {/if}
                </td>
            {/each}
        </tr>
        {#each marketDominanceSteps as mds, i}
            <tr>
                <td>
                    {`${(coin.marketDominance * mds.multiplier).toPrecision(
                        2
                    )}%`}
                    {#if i === 0}
                        <span class="text-small">Bearish</span>
                    {:else if i === 4}
                        <span class="text-small">Bullish</span>
                    {/if}
                    <span class="text-small">
                        {#if i !== 2}{mds.multiplier}{/if}
                        current
                    </span>
                </td>
                {#each marketCapSteps as mcs}
                    <td
                        >{formatNumber(
                            calculatePredictedPrice(coin, mds.multiplier, mcs)
                                .price
                        )}</td
                    >
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
