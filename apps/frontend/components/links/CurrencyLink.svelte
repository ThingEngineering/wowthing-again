<script lang="ts">
    import { data as settingsData } from '@/stores/settings'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number

    let url = ''
    $: {
        if ($settingsData.general.useWowdb) {
            url = `https://www.wowdb.com/currencies/${id}`
        }
        else {
            url = `https://${getWowheadDomain($settingsData.general.language)}.wowhead.com/currency=${id}`
        }
    }
</script>

<a href="{url}" on:click>
    <slot />
</a>
