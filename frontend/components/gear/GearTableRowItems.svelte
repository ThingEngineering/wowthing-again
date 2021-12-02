<script lang="ts">
    import { getContext } from 'svelte'

    import type {Character, CharacterGear} from '@/types'
    import {Constants} from '@/data/constants'
    import getCharacterGear from '@/utils/get-character-gear'
    import {getItemUrl} from '@/utils/get-item-url'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let highlightMissingEnchants: boolean
    export let highlightMissingGems: boolean
    export let rowspan = 0

    let characterGear: CharacterGear[]
    let useHighlighting = false
    $: {
        character = character || getContext('character')
        characterGear = getCharacterGear(character, {highlightMissingEnchants, highlightMissingGems})
        useHighlighting = highlightMissingEnchants || highlightMissingGems
    }
</script>

<style lang="scss">
    .gear {
        height: 44px;
        padding: 2px;
        position: relative;
        text-align: center;
        width: 46px;

        --image-border-width: 2px;
        --image-margin-top: 0;
    }
    .item-level {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        bottom: 3px;
        //color: #ffffff;
        font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    .no-problem {
        opacity: $inactive-opacity;
    }
    .problems {
        --image-border-color: #ffff00;

        display: flex;
        height: 24px;
        justify-content: flex-end;
        opacity: 1;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: -2px;
        z-index: 1;
    }
</style>

{#each characterGear as gear}
    <td class="gear" class:no-problem={useHighlighting && !gear.highlight} rowspan="{rowspan > 0 ? rowspan : null}">
        {#if gear.equipped !== undefined}
            <a class="quality{gear.equipped.quality}" href={getItemUrl(gear.equipped)}>
                <WowthingImage name="item/{gear.equipped.itemId}" size={40} border={2} />
                <span class="item-level">{gear.equipped.itemLevel}</span>
            </a>

            {#if gear.highlight}
                <div class="problems">
                    {#if gear.missingEnchant}
                        <WowthingImage name="{Constants.icons.enchant}" size={20} border={2} />
                    {/if}

                    {#if gear.missingGem}
                        <WowthingImage name="{Constants.icons.gem}" size={20} border={2} />
                    {/if}
                </div>
            {/if}
        {/if}
    </td>
{/each}
