<script lang="ts">
    import { seasonMap } from '@/data/dungeon'
    import { staticStore } from '@/stores/static'
    import getRaiderIoColor from'@/utils/get-raider-io-color'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterRaiderIoSeason, MythicPlusSeason } from '@/types'
    import type { StaticDataRaiderIoScoreTiers } from '@/types/data/static'

    import Tooltip from '@/components/tooltips/raiderio-scores/TooltipRaiderioScores.svelte'

    export let character: Character
    export let season: MythicPlusSeason = null
    export let seasonId = 0

    let scores: CharacterRaiderIoSeason
    let tiers: StaticDataRaiderIoScoreTiers

    $: {
        if (seasonId > 0) {
            season = seasonMap[seasonId]
        }
        if (season) {
            scores = character.raiderIo?.[season.id]
            tiers = $staticStore.data.raiderIoScoreTiers[season.id]
        }
    }
</script>

<style lang="scss">
    .score {
        @include cell-width($width-raider-io);

        border-left: 1px solid $border-color;
        text-align: right;
    }
</style>

{#if scores !== undefined && scores.all > 0}
    <td
        class="score"
        style:color={getRaiderIoColor(scores, tiers, scores['all'])}
        use:tippyComponent={{
            component: Tooltip,
            props: {character, scores, tiers},
        }}
    >{scores.all.toFixed(1)}</td
    >
{:else}
    <td class="score">&nbsp;</td>
{/if}
