<script lang="ts">
    import { settingsStore } from '@/stores'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'

    export let id: number
    export let noTooltip = false
    export let toComments = false

    let url = ''
    $: {
        if ($settingsStore.general.useWowdb) {
            url = `https://www.wowdb.com/npcs/${id}`
        }
        else {
            url = `https://${getWowheadDomain($settingsStore.general.language)}.wowhead.com/npc=${id}`
            if (toComments) {
                url += '#comments'
            }
        }
    }
</script>

{#if id > 0}
    <a
        href="{url}"
        data-disable-wowhead-tooltip="{noTooltip ? 'true' : undefined}">
        <slot />
    </a>
{:else}
    <slot />
{/if}
