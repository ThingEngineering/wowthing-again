<script lang="ts">
    import { itemModifierMap } from '@/data/item-modifier';
    import { appearanceState } from '@/stores/local-storage';
    import type { AppearanceDataModifiedAppearance } from '@/types/data/appearance';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        has: boolean;
        modifiedAppearance: AppearanceDataModifiedAppearance;
    };
    let { has, modifiedAppearance }: Props = $props();

    let imageName = $derived(
        'item/' +
            [
                modifiedAppearance.itemId.toString(),
                ...(modifiedAppearance.modifier > 0
                    ? [modifiedAppearance.modifier.toString()]
                    : []
                ).join('_'),
            ]
    );

    let [difficulty, difficultyShort, bonusId] = $derived(
        itemModifierMap[modifiedAppearance.modifier] || [
            modifiedAppearance.modifier.toString(),
            modifiedAppearance.modifier.toString(),
            0,
        ]
    );
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

<div
    class="appearance-item quality{modifiedAppearance.quality}"
    class:missing={(has && $appearanceState.highlightMissing) ||
        (!has && !$appearanceState.highlightMissing)}
>
    <WowheadLink
        id={modifiedAppearance.itemId}
        type="item"
        extraParams={bonusId ? { bonus: bonusId.toString() } : null}
    >
        <WowthingImage name={imageName} size={48} border={1} />

        {#if has}
            <CollectedIcon />
        {/if}
    </WowheadLink>

    {#if difficulty}
        <div class="pill difficulty" data-tooltip={difficulty}>
            {difficultyShort}
        </div>
    {/if}
</div>
