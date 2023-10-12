<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import type { StaticDataProfessionAbility } from '@/shared/stores/static/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'

    export let ability: StaticDataProfessionAbility
    export let currentRank: number
    export let totalRanks: number
    export let userHas: boolean
</script>

<style lang="scss">
    span {
        --scale: 0.9;

        padding-left: 0;
        text-align: right;
        width: 5rem;

        :global(a + a) {
            margin-left: -0.5rem;
        }
    }
</style>

{#if totalRanks > 1}
    <span
        class:status-success={userHas && currentRank === totalRanks}
        class:status-shrug={userHas && currentRank < totalRanks}
        class:status-fail={!userHas}
    >
        {#each Array(3) as _, index}
            <WowheadLink
                id={index === 0 ? ability.spellId : ability.extraRanks[index - 1][1]}
                type={"spell"}
            >
                <IconifyIcon
                    icon={iconStrings[index < currentRank && userHas ? 'starFull' : 'starEmpty']}
                />
            </WowheadLink>
        {/each}
    </span>
{/if}
