<script lang="ts">
    import type {CharacterGear} from '@/types'
    import {Constants} from '@/data/constants'
    import {getItemUrl} from '@/utils/get-item-url'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let gear: CharacterGear
    export let highlightMissingEnchants: boolean
    export let highlightMissingGems: boolean

    let hasProblem: boolean
    let highlightItem: boolean
    let useHighlighting: boolean
    $: {
        hasProblem = (gear.missingEnchant || gear.missingGem)
        highlightItem = (highlightMissingEnchants && gear.missingEnchant) ||
            (highlightMissingGems && gear.missingGem)
        useHighlighting = highlightMissingEnchants || highlightMissingGems
    }
</script>

<style lang="scss">
    div {
        height: 44px;
        position: relative;
        width: 44px;
    }
    div :global(img) {
        border-radius: $border-radius;
        border-width: 2px;
    }
    .item-level {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        bottom: 1px;
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
        --icon-border-color: #ffff00;

        display: flex;
        height: 44px;
        justify-content: flex-end;
        opacity: 1;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: -2px;
        z-index: 1;
    }
</style>

{#if gear.equipped !== undefined}
    <div class:no-problem={useHighlighting && !highlightItem}>
        <a class="quality{gear.equipped.quality}" href={getItemUrl(gear.equipped)}>
            <WowthingImage name="item/{gear.equipped.itemId}" size={40} border={2} />
            <span class="item-level">{gear.equipped.itemLevel}</span>
        </a>

        {#if hasProblem}
            <div class="problems">
                {#if gear.missingEnchant}
                    <WowthingImage name="{Constants.icons.enchant}" size={20} border={2} />
                {/if}

                {#if gear.missingGem}
                    <WowthingImage name="{Constants.icons.gem}" size={20} border={2} />
                {/if}
            </div>
        {/if}
    </div>
{:else}
    &nbsp;
{/if}
