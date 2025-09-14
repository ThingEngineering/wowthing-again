<script lang="ts">
    import { timeState } from '@/shared/state/time.svelte';
    import { toNiceDuration } from '@/utils/formatting';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --width: 4.5rem;

        text-align: right;
    }
</style>

<td class="border-left" data-tooltip="Addon data processed for this character">
    {#if character.lastSeenAddon}
        {@const diff = timeState.slowTime.diff(character.lastSeenAddon).toMillis()}
        <code>{@html toNiceDuration(diff)}</code>
    {:else}
        ???
    {/if}
</td>
