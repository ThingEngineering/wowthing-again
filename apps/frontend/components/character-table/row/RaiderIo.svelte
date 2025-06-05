<script lang="ts">
    import { seasonMap } from '@/data/mythic-plus';
    import { Region } from '@/enums/region';
    import { userStore } from '@/stores';
    import getRaiderIoColor from '@/utils/get-raider-io-color';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { MythicPlusSeason } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/mythic-plus-score/TooltipMythicPlusScore.svelte';

    type Props = {
        season?: MythicPlusSeason;
        seasonId?: number;
    };

    let { character, season, seasonId }: CharacterProps & Props = $props();

    let region = $derived(Region[character.realm.region].toLowerCase());
    let actualSeason = $derived(season || seasonMap[seasonId]);

    let scores = $derived(actualSeason ? character.raiderIo?.[season.id] : null);
    let tiers = $derived(actualSeason ? $userStore.raiderIoScoreTiers?.[season.id] : null);
    let overallScore = $derived(
        actualSeason ? character.mythicPlusSeasonScores?.[season.id] || scores?.['all'] || 0 : 0
    );
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
                seasonId: actualSeason.id,
                character,
                scores,
                tiers,
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
