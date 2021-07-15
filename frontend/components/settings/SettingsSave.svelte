<script lang="ts">
    import { data as settingsData } from '@/stores/settings'

    async function onClick() {
        const xsrf = document.getElementById('app').getAttribute('data-xsrf')
        await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
            body: JSON.stringify($settingsData),
        })
    }
</script>

<style lang="scss">
    div {
        padding: 0.5rem;
    }
    button {
        background: $button-success;
        border-radius: $border-radius;
        display: block;
        font-size: 1.2rem;
        margin: 0 auto;
        width: 80%;
    }
</style>

<div class="thing-container settings-container">
    <button type="submit" on:click|preventDefault={onClick}>Save changes</button>
</div>
