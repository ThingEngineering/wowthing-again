<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { itemModifierMap } from '@/data/item-modifier'
    import { appearanceState } from '@/stores/local-storage'
    import type { AppearanceDataAppearance } from '@/types/data/appearance'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/shared/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let appearance: AppearanceDataAppearance
    export let has: boolean

    let difficulty: string
    let imageName: string
    $: {
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
        border-width: 2px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: -1px;
    }

</style>

<svelte:options immutable={true} />

<div
    class="appearance-item quality{appearance.modifiedAppearances[0].quality}"
    class:missing={
        (has && $appearanceState.highlightMissing) ||
        (!has && !$appearanceState.highlightMissing)
    }
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
