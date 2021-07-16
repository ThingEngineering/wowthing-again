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
        console.log(obj)
        apiKey = obj['key']

        setTimeout(() => {
            apiKey = ''
        }, 10000)
    }
</script>

<style lang="scss">
    button {
        background: $button-success;
        border-radius: $border-radius;
        display: block;
        font-size: 1.2rem;
        margin: 0.3rem auto 0;
        width: 80%;
    }
    span {
        color: #00ccff;
        display: inline-block;
        font-size: 0.92rem;
        margin-top: 0.3rem;
        text-align: center;
        width: 100%;
    }
</style>

<div class="thing-container settings-container">
    <h2>API Key</h2>

    {#if apiKey}
        <span>{apiKey}</span>
    {:else}
        <button on:click|preventDefault={onClick}>Reveal API Key</button>
    {/if}
</div>
