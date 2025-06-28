<script lang="ts">
    import { lazyStore } from '@/stores';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/profession-cooldowns/TooltipProfessionCooldowns.svelte';

    let { character }: CharacterProps = $props();

    let data = $derived($lazyStore.characters[character.id].professionCooldowns);
</script>

<style lang="scss">
    td {
        @include cell-width(2rem, $maxWidth: 4rem);

        border-left: 1px solid var(--border-color);
        text-align: right;
        word-spacing: -0.2ch;
    }
</style>

{#if data?.total > 0}
    <td
        class:status-shrug={data.anyHalf && !data.anyFull}
        class:status-fail={data.anyFull}
        use:componentTooltip={{
            component: Tooltip,
            props: {
                character,
                cooldowns: data.cooldowns,
            },
        }}
    >
        {#if data.total > 0}
            {data.have} / {data.total}
        {/if}
    </td>
{:else}
    <td></td>
{/if}
