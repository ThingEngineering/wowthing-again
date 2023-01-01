<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { getItemUrl } from '@/utils/get-item-url'
    import { getProfessionEquipment } from '@/utils/professions'
    import type { Character } from '@/types'
    import type { StaticDataProfession} from '@/types/data/static'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let profession: StaticDataProfession

    $: equippedItems = getProfessionEquipment(character, profession.id)
</script>

<style lang="scss">
    .item-container {
        --image-border-width: 2px;
        --image-margin-top: 0;

        border-top: 1px solid $border-color;
        display: flex;
        gap: 0.2rem;
        justify-content: center;
        padding: 0.75rem 0;
    }
    .item {
        height: 52px;
        position: relative;
        width: 52px;
    }
    .item-level {
        bottom: 2px;
    }
    .crafted-quality {
        --scale: 1.2;

        background: rgba(0, 0, 0, 1);
        border-radius: 50%;
        position: absolute;
        right: -1px;
        top: -1px;
    }
    .empty-slot {
        background: rgba(0, 0, 0, 0.2);
        border-width: var(--image-border-width);
        height: 52px;
        width: 52px;
    }
</style>

<div class="item-container">
    {#each Array(3) as _, index}
        {@const equippedItem = equippedItems[index]}
        {#if equippedItem}
            <div class="item quality{equippedItem.quality}">
                <a href="{getItemUrl(equippedItem)}">
                    <WowthingImage
                        name="item/{equippedItem.itemId}"
                        size={48}
                        border={2}
                    />
                    
                    <span class="item-level pill abs-center">{equippedItem.itemLevel}</span>

                    {#if equippedItem.itemLevel > 300}
                        {@const craftedQuality = equippedItem.craftedQuality || 1}
                        <span class="crafted-quality quality{craftedQuality}">
                            <IconifyIcon
                                icon={iconStrings[`circle${craftedQuality}`]}
                            />
                        </span>
                    {/if}
                </a>
            </div>
        {:else}
            <div class="empty-slot border"></div>
        {/if}
    {/each}
</div>
