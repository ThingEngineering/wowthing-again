<script lang="ts">
    import { settingsStore } from '@/shared/stores/settings'

    export let id: number
    export let itemLevel = 0

    let url = ''
    $: {
        if ($settingsStore.general.useWowdb) {
            url = `https://www.wowdb.com/spells/${id}`
        }
        else {
            url = `https://${settingsStore.wowheadBaseUrl}/spell=${id}`
            if (itemLevel > 0) {
                url += `?ilvl=${itemLevel}`
            }
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
