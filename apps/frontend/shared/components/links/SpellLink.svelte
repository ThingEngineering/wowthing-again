<script lang="ts">
    import { settingsStore } from '@/stores'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number
    export let itemLevel = 0

    let url = ''
    $: {
        if ($settingsStore.general.useWowdb) {
            url = `https://www.wowdb.com/spells/${id}`
        }
        else {
            url = `https://${getWowheadDomain($settingsStore.general.language)}.wowhead.com/spell=${id}`
            if (itemLevel > 0) {
                url += `?ilvl=${itemLevel}`
            }
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
