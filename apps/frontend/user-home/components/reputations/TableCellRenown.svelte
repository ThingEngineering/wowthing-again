<script lang="ts">
    import { getRenownData } from './get-renown-data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userStore } from '@/stores';
    import type { StaticDataReputation } from '@/shared/stores/static/types';
    import type {
        Character,
        CharacterReputationParagon,
        CharacterReputationReputation,
    } from '@/types';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import Tooltip from '@/components/tooltips/reputation/TooltipReputationRenown.svelte';

    export let character: Character;
    export let reputation: ManualDataReputationSet;
    export let reputationsIndex: number;
    export let reputationSetsIndex: number;
    export let slug: string;

    let characterParagon: CharacterReputationParagon;
    let characterRep: CharacterReputationReputation;
    let cls: string;
    let dataRep: StaticDataReputation;
    let renownLevel: string;

    $: {
        ({ characterParagon, characterRep, cls, dataRep, renownLevel } = getRenownData({
            character,
            reputation,
            reputationsIndex,
            reputationSetsIndex,
            slug,
        }));
    }
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
            props: {
                characterRep: characterRep.value,
                character,
                characterParagon,
                dataRep,
                reputation,
            },
        }}
    >
        {renownLevel}
    </td>
{:else}
    <td></td>
{/if}
