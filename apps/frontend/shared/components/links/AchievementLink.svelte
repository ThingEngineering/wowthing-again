<script lang="ts">
    import { settingsStore } from '@/stores'

    export let id: number

    let url = ''
    $: {
        if ($settingsStore.general.useWowdb) {
            url = `https://www.wowdb.com/achievements/${id}`
        }
        else {
            url = `https://${settingsStore.wowheadBaseUrl}/achievement=${id}`
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
