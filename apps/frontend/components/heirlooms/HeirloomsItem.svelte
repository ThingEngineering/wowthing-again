<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { heirloomState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ManualDataHeirloomItem } from '@/types/data/manual';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { isUnavailable, item }: { isUnavailable: boolean; item: ManualDataHeirloomItem } =
        $props();

    let heirloom = $derived(wowthingData.static.heirloomByItemId.get(item.itemId));
    let level = $derived(userState.general.heirlooms.get(heirloom.id));
    let userHas = $derived(level !== undefined);
    let show = $derived(
        ((userHas && $heirloomState.showCollected) ||
            (!userHas && $heirloomState.showUncollected)) &&
            !(settingsState.value.collections.hideUnavailable && isUnavailable && !userHas)
    );
</script>

<style lang="scss">
    .collection-object {
        min-height: 52px;
        width: 52px;

        :global(img) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
    .pill {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: -1px;
    }
</style>

{#if show}
    <div class="collection-object quality7" class:missing={level === undefined}>
        <WowheadLink
            type="item"
            id={item.itemId}
            extraParams={{
                bonus: (heirloom.upgradeBonusIds[(level || 0) - 1] || 0).toString(),
            }}
        >
            <WowthingImage name="item/{item.itemId}" size={48} border={2} />
        </WowheadLink>

        {#if level !== undefined}
            <div class="pill {getPercentClass((level / heirloom.upgradeItemIds.length) * 100)}">
                {level} / {heirloom.upgradeBonusIds.length}
            </div>

            {#if level === heirloom.upgradeBonusIds.length}
                <CollectedIcon />
            {/if}
        {/if}
    </div>
{/if}
