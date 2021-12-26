<script lang="ts">
    import { data as settingsData } from '@/stores/settings'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number
    export let itemLevel = 0

    let url = ''
    $: {
        if ($settingsData.general.useWowdb) {
            url = `https://www.wowdb.com/spells/${id}`
        }
        else {
            url = `https://${getWowheadDomain($settingsData.general.language)}.wowhead.com/spell=${id}`
            if (itemLevel > 0) {
                url += `?ilvl=${itemLevel}`
            }
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
