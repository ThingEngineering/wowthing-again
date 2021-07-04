<script lang="ts">
    import { data as settingsData } from '@/stores/settings'

    async function onClick(e) {
        const xsrf = document.getElementById('app').getAttribute('data-xsrf')
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
            body: JSON.stringify($settingsData),
        })
    }
</script>

<div class="thing-container settings-container">
    <button type="submit" on:click|preventDefault={onClick}>Save changes</button>
</div>
