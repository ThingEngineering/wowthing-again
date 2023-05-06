<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { staticStore, userStore } from '@/stores'
    import { heirloomState } from '@/stores/local-storage'
    import getPercentClass from '@/utils/get-percent-class'
    import type { ManualDataHeirloomItem } from '@/types/data/manual'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'

    export let item: ManualDataHeirloomItem

    $: level = $userStore.heirlooms?.[item.itemId]
    $: [bonusIdsIndex, itemIdsIndex] = $staticStore.heirlooms[item.itemId]
    $: upgradeBonusIds = $staticStore.heirlooms[bonusIdsIndex]
    $: upgradeItemIds = $staticStore.heirlooms[itemIdsIndex]
    
    $: userHas = level !== undefined
    $: show = (userHas && $heirloomState.showCollected) || (!userHas && $heirloomState.showUncollected)
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
    <div
        class="collection-object quality7"
        class:missing={level === undefined}
    >
        <WowheadLink
            type="item"
            id={item.itemId}
            extraParams={{
                bonus: (upgradeBonusIds[(level || 0) - 1] || 0).toString()
            }}
        >
            <WowthingImage
                name="item/{item.itemId}"
                size={48}
                border={2}
            />
        </WowheadLink>

        {#if level !== undefined}
            <div class="pill {getPercentClass(level / upgradeItemIds.length * 100)}">
                {level} / {upgradeBonusIds.length}
            </div>

            {#if level === upgradeBonusIds.length}
                <div class="collected-icon drop-shadow">
                    <IconifyIcon icon={mdiCheckboxOutline} />
                </div>
            {/if}
        {/if}
    </div>
{/if}
