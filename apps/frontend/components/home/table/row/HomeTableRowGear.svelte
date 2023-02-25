<script lang="ts">
    import { Constants } from '@/data/constants'
    import { getTierPieces } from '@/utils/characters/get-tier-pieces'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/tier-set/TooltipTierSet.svelte'

    export let character: Character

    let tierCount: number
    let tierPieces: [string, number, number][]
    $: {
        tierPieces = getTierPieces(character)
        tierCount = tierPieces
            .filter(([, itemId]) => itemId > 0)
            .length
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-home-gear);

        --link-color: #{ $quality5-color };

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if character.level === Constants.characterMaxLevel}
    <td
        class:status-shrug={tierCount >= 2 && tierCount < 4}
        class:status-success={tierCount >= 4}
        use:tippyComponent={{
            component: Tooltip,
            props: {character, tierPieces},
        }}
    >
        {tierCount} pc
    </td>
{:else}
    <td></td>
{/if}
