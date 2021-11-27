<script lang="ts">
    import { data as settingsData } from '@/stores/settings'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let cls = ''
    export let id: number

    let url: string
    $: {
        url = `https://${getWowheadDomain($settingsData.general.language)}.wowhead.com/transmog-set=${id}`
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
