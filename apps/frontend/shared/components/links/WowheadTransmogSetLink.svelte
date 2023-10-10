<script lang="ts">
    import { settingsStore } from '@/stores'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let cls = ''
    export let id: number

    let url: string
    $: {
        url = `https://${getWowheadDomain($settingsStore.general.language)}.wowhead.com/transmog-set=${id}`
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
