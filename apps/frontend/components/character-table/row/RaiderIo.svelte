<script lang="ts">
    import { seasonMap } from '@/data/dungeon'
    import { staticStore } from '@/stores/static'
    import { Region } from '@/types/enums'
    import { getDungeonScores } from '@/utils/mythic-plus/get-dungeon-scores'
    import getRaiderIoColor from'@/utils/get-raider-io-color'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterRaiderIoSeason, MythicPlusSeason } from '@/types'
    import type { StaticDataRaiderIoScoreTiers } from '@/types/data/static'

    import Tooltip from '@/components/tooltips/mythic-plus-score/TooltipMythicPlusScore.svelte'

    export let character: Character
    export let season: MythicPlusSeason = null
    export let seasonId = 0

    let overallScore: string
    let region: string
    let scores: CharacterRaiderIoSeason
    let tiers: StaticDataRaiderIoScoreTiers
    $: {
        if (seasonId > 0) {
            season = seasonMap[seasonId]
        }
        if (season) {
            scores = character.raiderIo?.[season.id]
            tiers = $staticStore.data.raiderIoScoreTiers[season.id]

            let allScore = scores?.['all'] || 0

            const mapScores = character.mythicPlusSeasons?.[season.id]
            if (mapScores !== undefined) {
                let total = 0
                for (const addonMap of Object.values(mapScores)) {
                    const scores = getDungeonScores(addonMap)
                    total += scores.fortifiedFinal + scores.tyrannicalFinal
                }

                if (Math.abs(total - allScore) > 10) {
                    allScore = total
                }
            }
 
            overallScore = allScore.toFixed(1)
        }
        region = Region[character.realm.region].toLowerCase()
    }
</script>

<style lang="scss">
    .score {
        @include cell-width($width-raider-io);

        border-left: 1px solid $border-color;
        text-align: right;
    }
</style>

{#if scores?.all > 0}
    <td
        class="score"
        style:--link-color={getRaiderIoColor(scores, tiers, scores['all'])}
        use:tippyComponent={{
            component: Tooltip,
            props: {
                seasonId: season.id,
                character,
                scores,
                tiers
            },
        }}
    >
        <a
            href="https://raider.io/characters/{region}/{character.realm.slug}/{character.name}"
            rel="noopener noreferrer"
            target="_blank"
        >
            {overallScore}
        </a>
    </td>
{:else}
    <td class="score">&nbsp;</td>
{/if}
