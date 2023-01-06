<script lang="ts">
    import { settingsStore } from '@/stores'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number
    export let bonusIds: number[] = []

    let url = ''
    const params: Map<string, string> = new Map<string, string>()
    $: {
        if ($settingsStore.general.useWowdb) {
            url = `https://www.wowdb.com/items/${id}`
            if (bonusIds.length > 0) {
                params.set('bonusIDs', bonusIds.join(','))
            }
        }
        else {
            url = `https://${getWowheadDomain($settingsStore.general.language)}.wowhead.com/item=${id}`
        }

        // attach params
    }
</script>

<a href="{url}">
    <slot />
</a>
