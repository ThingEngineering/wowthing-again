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
    span {
        color: #00ccff;
        display: inline-block;
        font-size: 0.95rem;
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
