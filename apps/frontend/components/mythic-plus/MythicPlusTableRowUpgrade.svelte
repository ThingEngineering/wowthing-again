<script lang="ts">
    import {ratingItemLevelUpgrade} from '@/data/dungeon'
    import getFirstMatch from '@/utils/get-first-match'
    import { tippyComponent } from '@/utils/tippy'
    import type {Character, MythicPlusSeason} from '@/types'

    import Tooltip from '@/components/tooltips/mythic-plus-upgrade/TooltipMythicPlusUpgrade.svelte'

    export let character: Character
    export let season: MythicPlusSeason

    let score: number
    let upgrade: number
    $: {
        score = character.raiderIo?.[season.id]?.all ?? 0
        upgrade = getFirstMatch(ratingItemLevelUpgrade, score)
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-mplus-upgrade);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

<td
    use:tippyComponent={{
        component: Tooltip,
        props: {character, score},
    }}
>{upgrade}</td>
