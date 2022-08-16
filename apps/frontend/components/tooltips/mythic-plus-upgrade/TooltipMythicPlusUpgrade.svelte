<script lang="ts">
    import { Constants } from '@/data/constants'
    import { ratingItemLevelUpgrade } from '@/data/dungeon'
    import { staticStore } from '@/stores'
    import type { Character, CharacterCurrency } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let score: number

    const ratings = ratingItemLevelUpgrade.slice()
    ratings.reverse()

    let valor: CharacterCurrency
    $: {
        valor = character.currencies?.[Constants.valorCurrencyId]
    }
</script>

<style lang="scss">
    table {
        width: 10rem;
    }
    tbody > tr:first-child {
        background: $active-background;
    }

    .score {
        @include cell-width(3rem);

        text-align: right;
    }
    .item-level {
        @include cell-width(3rem, $paddingLeft: 0.75rem);

        text-align: left;
    }
    .bottom {
        --image-border-width: 1px;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>M+ Upgrades</h5>
    <table class="table-striped">
        <thead>
            <tr>
                <th class="score">Score</th>
                <th class="item-level">Level</th>
            </tr>
        </thead>

        <tbody>
            {#each ratings as [scoreThreshold, itemLevel], ratingIndex}
                {#if ratings[ratingIndex + 1] === undefined || score < ratings[ratingIndex + 1][0]}
                    <tr>
                        <td class="score">{Math.max(score, scoreThreshold).toFixed(0)}</td>
                        <td class="item-level">{itemLevel}</td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>

    {#if valor}
        <div class="bottom">
            <WowthingImage
                name="currency/{Constants.valorCurrencyId}"
                size={20}
                border={1}
            />
            {valor.quantity.toLocaleString()}
            {$staticStore.data.currencies?.[Constants.valorCurrencyId]?.name}
        </div>
    {/if}
</div>
