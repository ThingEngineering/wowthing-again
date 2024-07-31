<script lang="ts">
    import { settingsStore } from '@/shared/stores/settings'

    export let cls = ''
    export let id: number

    let url: string
    $: {
        url = `https://${settingsStore.wowheadBaseUrl}/transmog-set=${id}`
    }
</script>

<style lang="scss">
    a {
        display: block;
    }
</style>

<a href="{url}" class="{cls}">
    <slot />
</a>
