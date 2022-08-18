<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { userTransmogStore } from '@/stores'
    import type { AppearanceDataAppearance } from '@/types/data/appearance'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
import { itemModifierMap } from '@/data/item-modifier';

    export let appearance: AppearanceDataAppearance

    let difficulty: string
    let has: boolean
    let imageName: string
    $: {
        has = $userTransmogStore.data.userHas[appearance.appearanceId]

        const mod = appearance.modifiedAppearances[0]

        imageName = `item/${mod.itemId}`
        if (mod.modifier > 0) {
            imageName += `_${mod.modifier}`
        }

        difficulty = itemModifierMap[mod.modifier]?.[1] || mod.modifier.toString()
    }
</script>

<style lang="scss">
    .appearance-item {
        :global(img) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom-width: 1px;
        }
    }
    .difficulty {
        // background-color: $highlight-background;
        // border: 1px solid;
        // border-radius: $border-radius-small;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: -1px;
        // padding: 0 2px 1px 2px;
        // text-align: center;
        // white-space: nowrap;
    }

</style>

<div
    class="appearance-item quality{appearance.modifiedAppearances[0].quality}"
    class:missing={has}
>
    <WowheadLink
        id={appearance.modifiedAppearances[0].itemId}
        type="item"
    >
        <WowthingImage
            name={imageName}
            size={48}
            border={1}
        />

        {#if has}
            <div class="collected-icon drop-shadow">
                <IconifyIcon icon={mdiCheckboxOutline} />
            </div>
        {/if}
    </WowheadLink>

    {#if difficulty}
        <div class="pill difficulty">
            {difficulty}
        </div>
    {/if}
</div>
