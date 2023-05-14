<script lang="ts">
    import { Constants } from '@/data/constants'
    import { userStore } from '@/stores'
    import getItemLevelQuality from '@/utils/get-item-level-quality'
    import type { CharacterCurrency, Character } from '@/types'

    export let character: Character
    export let tierSets: [string, number, number][][]

    let charCatalyst: CharacterCurrency
    let haveCharges: number
    let maxCharges: number
    $: {
        charCatalyst = character.currencies?.[Constants.currencies.catalyst]

        const accountMaxCharges = Math.max(
            ...$userStore.characters
                .map((char) => char.currencies?.[Constants.currencies.catalyst]?.max || 0)
        )

        if (!charCatalyst) {
            haveCharges = maxCharges = accountMaxCharges
        }
        else if (accountMaxCharges > charCatalyst.max) {
            haveCharges = charCatalyst.quantity + (accountMaxCharges - charCatalyst.max)
            maxCharges = accountMaxCharges
        }
        else {
            haveCharges = charCatalyst.quantity
            maxCharges = charCatalyst.max
        }
    }
</script>

<style lang="scss">
    .flex-wrapper {
        gap: 1rem;
    }
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

    <div class="flex-wrapper">
        {#each tierSets as tierPieces, setIndex}
            <table
                class="table-striped"
                class:border-left="{tierSets.length > 1 && setIndex === 1}"
                class:border-right="{tierSets.length > 1 && setIndex === 0}"
            >
                <tbody>
                    {#if tierSets.length > 1}
                        <tr>
                            <td colspan="2">{setIndex === 0 ? 'Current' : 'Previous'}
                        </tr>
                    {/if}

                    {#each tierPieces as [slot, , itemLevel]}
                        <tr>
                            <td class="slot">{slot}</td>
                            <td
                                class="itemLevel quality{getItemLevelQuality(itemLevel)}"
                            >
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
        {/each}
    </div>

    {#if maxCharges}
        <div class="bottom">
            <div>
                {haveCharges} / {maxCharges} charges
            </div>
        </div>
    {/if}
</div>
