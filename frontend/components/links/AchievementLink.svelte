<script lang="ts">
    import { data as settingsData } from '@/stores/settings'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number

    let url = ''
    $: {
        if ($settingsData.general.useWowdb) {
            url = `https://www.wowdb.com/achievements/${id}`
        }
        else {
            url = `https://${getWowheadDomain($settingsData.general.language)}.wowhead.com/achievement=${id}`
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
