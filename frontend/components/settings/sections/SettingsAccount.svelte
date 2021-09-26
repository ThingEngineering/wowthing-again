<script lang="ts">
    let apiKey = ''

    async function onClick() {
        const xsrf = document.getElementById('app').getAttribute('data-xsrf')
        const response = await fetch('/api/api-key-get', {
            headers: {
                'RequestVerificationToken': xsrf,
            },
        })
        const obj = await response.json()
        apiKey = obj['key']

        setTimeout(() => {
            apiKey = ''
        }, 8000)
    }
</script>

<style lang="scss">

    .api-key {
        align-items: center;
        display: flex;
        gap: 1rem;
        width: 100%;

        :first-child {
            flex: 0 0 18rem;
        }

        button {
            background: $button-success;
            border-radius: $border-radius;
            display: block;
            font-size: 1.2rem;
            margin: 0.3rem auto 0;
        }
        span {
            border: 1px solid $border-color;
            border-radius: $border-radius;
            color: #00ccff;
            display: inline-block;
            font-size: 0.92rem;
            height: 100%;
            margin-top: 0.3rem;
            text-align: center;
        }

        p {
            flex: 1;
            margin: 0;
        }
    }
</style>

<div class="thing-container settings-container">
    <h2>Account</h2>

    <h3>API Key</h3>

    <div class="api-key">
        {#if apiKey}
            <span>{apiKey}</span>
        {:else}
            <button on:click|preventDefault={onClick}>Reveal API Key</button>
        {/if}

        <p>
            Use this API key with <a href="https://github.com/ThingEngineering/wowthing-sync">WoWthing Sync</a>
            to automate the uploading of your <code>WoWthing_Collector.lua</code>
            files.
        </p>
    </div>
</div>
