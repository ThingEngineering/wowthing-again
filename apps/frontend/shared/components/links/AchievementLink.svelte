<script lang="ts">
    import { settingsStore } from '@/stores'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number

    let url = ''
    $: {
        if ($settingsStore.general.useWowdb) {
            url = `https://www.wowdb.com/achievements/${id}`
        }
        else {
            url = `https://${getWowheadDomain($settingsStore.general.language)}.wowhead.com/achievement=${id}`
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
