<script lang="ts">
    import { keyTiers } from '@/data/dungeon'
    import { getRunCounts } from '@/utils/dungeon'
    import type { CharacterMythicPlusAddonMap, CharacterMythicPlusAddonRun } from '@/types'

    export let addonMap: CharacterMythicPlusAddonMap
    export let allRuns: CharacterMythicPlusAddonRun[]

    let fortifiedInitial: number
    let fortifiedFinal: number
    let tyrannicalInitial: number
    let tyrannicalFinal: number
    let runCounts: number[]
    $: {
        fortifiedInitial = addonMap?.fortifiedScore?.score ?? 0
        tyrannicalInitial = addonMap?.tyrannicalScore?.score ?? 0
        if (fortifiedInitial >= tyrannicalInitial) {
            fortifiedFinal = fortifiedInitial * 1.5
            tyrannicalFinal = tyrannicalInitial / 2
        }
        else {
            fortifiedFinal = fortifiedInitial / 2
            tyrannicalFinal = tyrannicalInitial * 1.5
        }

        runCounts = getRunCounts(allRuns)
    }
</script>

<style lang="scss">
    .addon-wrapper {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        padding: 0 1rem;
        width: 20rem;
    }
    .runs-wrapper {
        flex-wrap: wrap;
    }
    .data-box {
        background: $thing-background;
        padding: 0.2rem 0.4rem;
        white-space: nowrap;
    }
</style>

<div class="addon-wrapper">
    <div
        class="data-box border"
    >
        Total: {fortifiedFinal + tyrannicalFinal}
    </div>
    <div
        class="data-box border"
        class:border-fail={fortifiedInitial === 0}
        class:border-shrug={fortifiedInitial > 0 && fortifiedInitial < tyrannicalInitial}
        class:border-success={fortifiedInitial > 0 && fortifiedInitial > tyrannicalInitial}
    >
        Fort: {fortifiedInitial}
    </div>
    <div
        class="data-box border"
        class:border-fail={tyrannicalInitial === 0}
        class:border-shrug={tyrannicalInitial > 0 && tyrannicalInitial < fortifiedInitial}
        class:border-success={tyrannicalInitial > 0 && tyrannicalInitial > fortifiedInitial}
    >
        Tyr: {tyrannicalInitial}
    </div>
</div>

{#if runCounts.length > 0}
    <div class="addon-wrapper runs-wrapper">
        {#each runCounts as count, countIndex}
            {#if count > 0}
                <div
                    class="data-box border quality{Math.min(5, countIndex + 1)}-border"
                >
                    {keyTiers[countIndex]}: {count}
                </div>
            {/if}
        {/each}
    </div>
{/if}
