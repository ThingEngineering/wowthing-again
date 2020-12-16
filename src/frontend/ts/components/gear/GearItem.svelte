<script lang="ts">
    import {Character} from '../../types'
    import {InventorySlot} from '../../data/inventory-slot'
    import WowthingImage from '../images/sources/WowthingImage.svelte'

    export let character: Character
    export let inventorySlot: InventorySlot

    $: equipped = character.equippedItems[inventorySlot]
</script>

<style lang="scss">
    @import "scss/variables.scss";

    td {
        text-align: center;
        width: 46px;
    }
    div {
        height: 44px;
        position: relative;
        width: 44px;
    }
    div :global(img) {
        border-radius: $thing-border-radius;
        border-width: 2px;
    }
    span {
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
</style>

<td>
    {#if equipped !== undefined}
        <div>
            <a class="quality{equipped.quality}" href="https://www.wowdb.com">
                <WowthingImage size="40" name="item/{equipped.itemId}" border="2" />
                <span>{equipped.itemLevel}</span>
            </a>
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
