<script lang="ts">
    import type {Character, MythicPlusSeason} from '@/types'
    import {ratingItemLevelUpgrade} from '@/data/dungeon'
    import getFirstMatch from '@/utils/get-first-match'

    export let character: Character
    export let season: MythicPlusSeason

    let upgrade: number
    $: {
        const rating = character.raiderIo?.[season.Id]?.all ?? 0
        upgrade = getFirstMatch(ratingItemLevelUpgrade, rating)
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-mplus-upgrade, $paddingLeft: 0px);

        text-align: center;
    }
</style>

<td>{upgrade}</td>
