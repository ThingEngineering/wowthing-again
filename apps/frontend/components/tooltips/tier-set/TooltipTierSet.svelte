<script lang="ts">
    import { Constants } from '@/data/constants'
    import { staticStore } from '@/stores'
    import getItemLevelQuality from '@/utils/get-item-level-quality'
    import type { Character } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let tierPieces: [string, number][]

    $: catalyst = character.currencies?.[Constants.catalystCurrencyId]

</script>

<style lang="scss">
    .slot {
        text-align: left;
    }
    .itemLevel {
        @include cell-width(2rem);

        text-align: center;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Tier Set Pieces</h5>
    <table class="table-striped">
        <tbody>
            {#each tierPieces as [slot, itemLevel]}
                <tr>
                    <td class="slot">{slot}</td>
                    <td class="itemLevel quality{getItemLevelQuality(itemLevel)}">
                        {#if itemLevel > 0}
                            {itemLevel}
                        {:else}
                            &mdash;
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if catalyst}
        <div class="bottom">
            <div>
                {catalyst.quantity.toLocaleString()}
                /
                {catalyst.max.toLocaleString()}
                charges
            </div>
        </div>
    {/if}
</div>
