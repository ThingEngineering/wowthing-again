<script lang="ts">
    import { itemModifierMap } from '@/data/item-modifier'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { appearanceState } from '@/stores/local-storage'
    import type { AppearanceDataAppearance, AppearanceDataModifiedAppearance } from '@/types/data/appearance'

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let has: boolean
    export let modifiedAppearance: AppearanceDataModifiedAppearance

    let bonusId: number
    let difficulty: string
    let difficultyShort: string
    let imageName: string
    $: {
        const mod = modifiedAppearance

        imageName = `item/${mod.itemId}`
        if (mod.modifier > 0) {
            imageName += `_${mod.modifier}`
        }

        if (itemModifierMap[mod.modifier]) {
            [difficulty, difficultyShort, bonusId] = itemModifierMap[mod.modifier]
        }
        else {
            const modifierString = mod.modifier.toString();
            [difficulty, difficultyShort, bonusId] = [modifierString, modifierString, 0]
        }
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
    class="appearance-item quality{modifiedAppearance.quality}"
    class:missing={
        (has && $appearanceState.highlightMissing) ||
        (!has && !$appearanceState.highlightMissing)
    }
>
    <WowheadLink
        id={modifiedAppearance.itemId}
        type="item"
        extraParams={bonusId ? { 'bonus': bonusId.toString() } : null}
    >
        <WowthingImage
            name={imageName}
            size={48}
            border={1}
        />

        {#if has}
            <CollectedIcon />
        {/if}
    </WowheadLink>

    {#if difficulty}
        <div
            class="pill difficulty"
            use:basicTooltip={difficulty}
        >
            {difficultyShort}
        </div>
    {/if}
</div>
