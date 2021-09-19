<script lang="ts">
    import { data as settingsData } from '@/stores/settings'

    export let id: number
    export let noTooltip = false
    export let toComments = false

    let url = ''
    $: {
        if ($settingsData.general.useWowdb) {
            url = `https://www.wowdb.com/npcs/${id}`
        }
        else {
            url = `https://www.wowhead.com/npc=${id}`
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
