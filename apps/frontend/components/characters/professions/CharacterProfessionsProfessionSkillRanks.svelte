<script lang="ts">
    import { uiIcons } from '@/shared/icons';
    import type { StaticDataProfessionAbility } from '@/shared/stores/static/types';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    type Props = {
        ability: StaticDataProfessionAbility;
        currentRank: number;
        totalRanks: number;
        userHas: boolean;
    };
    let { ability, currentRank, totalRanks, userHas }: Props = $props();
</script>

<style lang="scss">
    span {
        padding-left: 0;
        text-align: right;
        width: 5rem;

        :global(a + a) {
            margin-left: -0.2rem;
        }
    }
</style>

{#if totalRanks > 1}
    <span
        class:status-success={userHas && currentRank === totalRanks}
        class:status-shrug={userHas && currentRank < totalRanks}
        class:status-fail={!userHas}
    >
        {#each { length: Math.max(totalRanks, 3) }, index}
            <WowheadLink
                id={index === 0 ? ability.spellId : ability.extraRanks[index - 1][1]}
                type="spell"
            >
                <IconifyWrapper
                    icon={index < currentRank && userHas ? uiIcons.starFull : uiIcons.starEmpty}
                />
            </WowheadLink>
        {/each}
    </span>
{/if}
