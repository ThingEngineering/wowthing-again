<script lang="ts">
    import { getRenownData } from './get-renown-data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { ManualDataReputationSet } from '@/types/data/manual';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/reputation/TooltipReputationRenown.svelte';

    type Props = CharacterProps & {
        reputation: ManualDataReputationSet;
        reputationsIndex: number;
        reputationSetsIndex: number;
        slug: string;
    };
    let { character, reputation, reputationsIndex, reputationSetsIndex, slug }: Props = $props();

    let { characterParagon, characterRep, cls, dataRep, renownLevel } = $derived(
        getRenownData({
            character,
            reputation,
            reputationsIndex,
            reputationSetsIndex,
            slug,
        })
    );
</script>

<style lang="scss">
    td {
        border-left: 1px solid var(--border-color);
        text-align: center;
    }
</style>

{#if renownLevel}
    <td
        class={cls}
        class:status-fail={characterParagon?.rewardAvailable}
        use:componentTooltip={{
            component: Tooltip,
            propsFunc: () => ({
                characterRep: characterRep.value,
                character,
                characterParagon,
                dataRep,
                reputation,
            }),
        }}
    >
        {renownLevel}
    </td>
{:else}
    <td></td>
{/if}
