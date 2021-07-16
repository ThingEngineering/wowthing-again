<script lang="ts">
    import { data as settingsData } from '@/stores/settings'

    export let id: number

    let url = ''
    $: {
        if ($settingsData.general.useWowdb) {
            url = `https://www.wowdb.com/spells/${id}`
        }
        else {
            url = `https://www.wowhead.com/spell=${id}`
        }
    }
</script>

<a href="{url}">
    <slot />
</a>
