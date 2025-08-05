<script lang="ts">
    import { Constants } from '@/data/constants';
    import { iconLibrary } from '@/shared/icons';
    import { userState } from '@/user-home/state/user';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import type { LazyConvertibleCharacterItem } from '@/user-home/state/lazy/convertible.svelte';
    import type { CharacterCurrency, Character } from '@/types';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    export let character: Character;
    export let tierSets: [string, number, number, LazyConvertibleCharacterItem?][][];

    let charCatalyst: CharacterCurrency;
    let haveCharges: number;
    let maxCharges: number;
    $: {
        charCatalyst = character.currencies?.[Constants.currencies.catalyst];

        const accountMaxCharges = Math.max(
            ...userState.general.activeCharacters.map(
                (char) => char.currencies?.[Constants.currencies.catalyst]?.max || 0
            )
        );

        if (!charCatalyst) {
            haveCharges = maxCharges = accountMaxCharges;
        } else if (accountMaxCharges > charCatalyst.max) {
            haveCharges = charCatalyst.quantity + (accountMaxCharges - charCatalyst.max);
            maxCharges = accountMaxCharges;
        } else {
            haveCharges = charCatalyst.quantity;
            maxCharges = charCatalyst.max;
        }
    }
</script>

<style lang="scss">
    .flex-wrapper {
        gap: 1rem;
    }
    table {
        border-bottom: 1px solid var(--border-color);
        margin-bottom: -1px;
    }
    .slot {
        @include cell-width(5rem);

        text-align: left;
    }
    .itemLevel {
        @include cell-width(2rem, $maxWidth: 4rem);

        text-align: center;
        white-space: nowrap;
    }
    .gem {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Tier Set Pieces</h5>

    <div class="flex-wrapper">
        {#each tierSets as tierPieces, setIndex (tierPieces)}
            <table
                class="table-striped"
                class:border-left={tierSets.length > 1 && setIndex === 1}
                class:border-right={tierSets.length > 1 && setIndex === 0}
            >
                <tbody>
                    {#if tierSets.length > 1}
                        <tr> <td colspan="2">{setIndex === 0 ? 'Current' : 'Previous'} </td></tr>
                    {/if}

                    {#each tierPieces as [slot, , itemLevel, convertible] (slot)}
                        <tr>
                            <td class="slot">{slot}</td>
                            <td class="itemLevel quality{getItemLevelQuality(itemLevel)}">
                                {#if itemLevel > 0}
                                    {itemLevel}
                                {:else if convertible && !convertible.isPurchased}
                                    {convertible.equippedItem.itemLevel}
                                    <IconifyIcon
                                        extraClass={convertible.canConvert
                                            ? 'status-shrug'
                                            : 'status-fail'}
                                        icon={iconLibrary.gameShurikenAperture}
                                        scale="0.85"
                                    />
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
