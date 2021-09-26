<script lang="ts">
    import type { Settings, SidebarItem } from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'
    import { data as settingsData } from '@/stores/settings'

    export const categories: SidebarItem[] = [
        {
            name: 'Account',
            slug: 'account',
        },
        {
            name: 'Privacy',
            slug: 'privacy',
        },
        null,
        {
            name: 'Hide Characters',
            slug: 'hide-characters',
        },
        {
            name: 'Layout',
            slug: 'layout',
        },
        {
            name: 'Transmog',
            slug: 'transmog',
        },
    ]

    let buttonText = 'Save changes'
    async function saveOnClick() {
        buttonText = 'Saving...'
        const xsrf = document.getElementById('app').getAttribute('data-xsrf')
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
            body: JSON.stringify($settingsData),
        })
        if (response.ok) {
            const json = await response.json()
            settingsData.set(json as Settings)
            buttonText = 'Saved!'
            setTimeout(() => { buttonText = 'Save changes'}, 1000)
        }
    }
</script>

<style lang="scss">
    button {
        background: $button-success;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        cursor: pointer;
        font-size: 1.1rem;
        margin-top: 1rem;
        width: 100%;
    }
</style>

<Sidebar
    baseUrl="/settings"
    items={categories}
    width="10rem"
>
    <svelte:fragment slot="after">
        <button on:click|preventDefault={saveOnClick}>{buttonText}</button>
    </svelte:fragment>
</Sidebar>
