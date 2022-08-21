<script lang="ts">
    import find from 'lodash/find'

    import { keyTiers, seasonMap } from '@/data/dungeon'
    import { userStore } from '@/stores'
    import { getRunCounts } from '@/utils/dungeon'
    import type { CharacterMythicPlusAddonRun } from '@/types'

    export let slug: string

    let runCounts: number[]
    let totalRuns: number
    $: {
        const season = find(seasonMap, (season) => season.slug === slug)
        const allRuns: CharacterMythicPlusAddonRun[] = []
        for (const character of $userStore.data.characters) {
            allRuns.push(...(character.mythicPlusAddon?.[season.id]?.runs || []))
        }

        runCounts = getRunCounts(allRuns)
        totalRuns = runCounts.reduce((a, b) => a + b, 0)
    }
</script>

<style lang="scss">
    .flex-wrapper {
        gap: 0.4rem;
        justify-content: flex-start;
    }
    .stats-box {
        background: $thing-background;
        margin-top: 0.5rem;
        padding: 0.1rem 0.3rem;
        white-space: nowrap;

        &:first-child {
            margin-right: 0.4rem;
        }
    }
</style>

{#if totalRuns > 0}
    <div class="flex-wrapper">
        <div class="stats-box border">Total: {totalRuns}</div>

        {#each runCounts as count, countIndex}
            <div
                class="stats-box border quality{Math.min(5, countIndex + 1)}-border"
            >
                {keyTiers[countIndex]}: {count}
            </div>
        {/each}
    </div>
{/if}
