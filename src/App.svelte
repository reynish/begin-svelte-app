<script>
    import Analytics from "analytics";
    import googleAnalytics from "@analytics/google-analytics";
    import { onMount } from "svelte";
    import Table from "./Table.svelte";
    import {
        totalMarketCap,
        formatMarketCap,
    } from "./stores/totalMarketCap.js";
    import { coinName } from "./stores/coin.js";
    import * as helpers from "./functions/helpers.js";

    let analytics;
    onMount(() => {
        analytics = Analytics({
            app: "prices.yoyomofo.co.uk",
            plugins: [
                googleAnalytics({
                    trackingId: "G-EW8CXL3D2N",
                }),
            ],
        });
    });

    let coin = getCoin();

    async function getCoin() {
        coin = await fetch(
            `https://api.coingecko.com/api/v3/coins/${$coinName}?tickers=false&community_data=false&developer_data=false&sparkline=false`
        )
            .then((response) => response.json())
            .then((response) => {
                if (response.error) {
                    throw new Error(response.error);
                } else {
                    return response;
                }
            })
            .then((data) => {
                const marketCap = data.market_data.market_cap["usd"];
                const circulatingSupply = data.market_data.circulating_supply;
                if (!marketCap || !circulatingSupply) {
                    throw new Error(
                        `Couldn't get either a circulating supply or a market cap for ${data.name}`
                    );
                }
                analytics.track("coin", {
                    category: "View coin",
                    label: "something",
                    value: data.name,
                });
                return {
                    id: data.id,
                    name: data.name,
                    marketCap,
                    // marketDominance,
                    price: data.market_data.current_price["usd"],
                    circulatingSupply,
                };
            })
            .catch((err) => {
                analytics.track("error", {
                    category: "Error",
                    label: "something",
                    value: err.message,
                });
                throw new Error(err);
            });
    }

    let timer;
    // debouncing is always a good idea :]
    const handleKeyup = (event) => {
        // coin = new Promise();
        clearTimeout(timer);
        timer = setTimeout(() => {
            coinName.set(event.target.value);
            coin = getCoin();
        }, 250);
    };

    $: console.log(JSON.stringify(coin, null, 2));
</script>

<header>
    <div for="coin" class="header-coin">
        <div class="header-section">
            <label for="">
                <span class="display-none">coin</span>
            </label>
            <input
                name="coin"
                class="input_transparent"
                bind:value={$coinName}
                on:keyup={handleKeyup}
                placeholder="coin"
            />
        </div>
        {#await coin}
            <div class="header-section">
                <span class="value">waiting....</span>
            </div>
        {:then coin}
            <div class="header-section">
                <span class="label">Price:</span>
                <span class="value">{helpers.formatPrice(coin.price)}</span>
            </div>

            <div class="header-section">
                <span class="label">Dominance:</span>
                <span class="value"
                    >{`${((coin.marketCap / $totalMarketCap) * 100).toPrecision(
                        2
                    )}%`}</span
                >
            </div>
        {:catch error}
            <p style="color: #d4ff0d">{error.message}</p>
        {/await}
    </div>
    <div class="header-marketcap">
        <div class="header-section">
            <span class="label">Crypto Market Cap:</span>
            <span class="value">{formatMarketCap($totalMarketCap)}</span>
        </div>
    </div>
</header>
<main>
    {#await coin then coin}
        <Table {coin} />
    {/await}
</main>
<footer>
    <div style="margin: 1rem 0">
        <a href="https://twitter.com/yoyo_blahmcblah" target="_blank"
            >@yoyo_blahmcblah</a
        >
        was inspired by
        <a href="https://youtube.com" target="_blank">Benjamin Cowen</a>
        &
        <a href="https://youtube.com" target="_blank">Token Metrics</a>
    </div>
</footer>

<style>
</style>
