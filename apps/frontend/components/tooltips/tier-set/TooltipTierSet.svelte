<script lang="ts">
    import { Constants } from '@/data/constants';
    import { iconLibrary } from '@/shared/icons';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import type { LazyConvertibleCharacterItem } from '@/stores/lazy/convertible';
    import type { CharacterCurrency, Character } from '@/types';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

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

    $: cyrce = Object.values(character.equippedItems || {}).filter(
        (item) => item.itemId === 228411
    )[0];
</script>

<style lang="scss">
    .flex-wrapper {
        gap: 1rem;
    }
    table {
        border-bottom: 1px solid $border-color;
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
    .cyrce {
        padding: 0.5rem 0.5rem;
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

    {#if cyrce}
        <div class="cyrce">
            {#each [0, 1, 2] as gemIndex (gemIndex)}
                {@const gem = wowthingData.items.items[cyrce.gemIds[gemIndex]]}
                <div class="gem">
                    {#if gem}
                        <WowthingImage name={`item/${gem.id}`} size={16} border={1} />
                        <ParsedText text={`{item:${gem.id}}`} />
                    {:else}
                        <WowthingImage name="item/20817" size={16} border={1} />
                        Empty Cyrce slot!
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    {#if maxCharges}
        <div class="bottom">
            <div>
                {haveCharges} / {maxCharges} charges
            </div>
        </div>
    {/if}
</div>
