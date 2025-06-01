<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    export let id: number;
    export let noTooltip = false;
    export let toComments = false;

    let url = '';
    $: {
        if (settingsState.value.general.useWowdb) {
            url = `https://www.wowdb.com/npcs/${id}`;
        } else {
            url = `https://${settingsState.wowheadBaseUrl}/npc=${id}`;
            if (toComments) {
                url += '#comments';
            }
        }
    }
</script>

{#if id > 0}
    <a href={url} data-disable-wowhead-tooltip={noTooltip ? 'true' : undefined}>
        <slot />
    </a>
{:else}
    <slot />
{/if}
