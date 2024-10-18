<script lang="ts">
    import { timeStore } from '@/shared/stores/time';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { toNiceDuration } from '@/utils/formatting';
    import type { Character } from '@/types';

    export let character: Character
</script>

<style lang="scss">
    td {
        @include cell-width(4.5rem);

        text-align: right;
    }
</style>

<td
    class="border-left"
    use:basicTooltip={'Addon data processed for this character'}
>
    {#if character.lastSeenAddon}
        {@const diff = $timeStore.diff(character.lastSeenAddon).toMillis()}
        <code>{@html toNiceDuration(diff)}</code>
    {:else}
        ???
    {/if}
</td>
