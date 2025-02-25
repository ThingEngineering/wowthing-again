<script lang="ts">
    import { seasonMap } from '@/data/mythic-plus'
    import { Region } from '@/enums/region'
    import { userStore } from '@/stores'
    import getRaiderIoColor from'@/utils/get-raider-io-color'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character, CharacterRaiderIoSeason, MythicPlusSeason } from '@/types'
    import type { UserDataRaiderIoScoreTiers } from '@/types/user-data'

    import Tooltip from '@/components/tooltips/mythic-plus-score/TooltipMythicPlusScore.svelte'

    export let character: Character
    export let season: MythicPlusSeason = null
    export let seasonId = 0

    let overallScore: number
    let region: string
    let scores: CharacterRaiderIoSeason
    let tiers: UserDataRaiderIoScoreTiers
    $: {
        if (seasonId > 0) {
            season = seasonMap[seasonId]
        }
        if (season) {
            scores = character.raiderIo?.[season.id]
            tiers = $userStore.raiderIoScoreTiers?.[season.id]

            overallScore = character.mythicPlusSeasonScores?.[season.id] || scores?.['all'] || 0
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

{#if overallScore > 0}
    <td
        class="score"
        style:--link-color={getRaiderIoColor(tiers, overallScore)}
        use:componentTooltip={{
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
            {overallScore.toFixed(1)}
        </a>
    </td>
{:else}
    <td class="score">&nbsp;</td>
{/if}
