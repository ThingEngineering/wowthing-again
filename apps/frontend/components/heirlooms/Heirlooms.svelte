<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { heirloomBonusIds } from '@/data/heirlooms'
    import { lazyStore, manualStore, userStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import type { ManualDataHeirloomGroup } from '@/types/data/manual'

    import Count from '@/components/collectible/CollectibleCount.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'

    let sections: [string, ManualDataHeirloomGroup[]][]
    $: {
        sections = [
            ['Available', $manualStore.heirlooms.filter((group) => !group.name.startsWith('Unavailable'))],
            ['Unavailable', $manualStore.heirlooms.filter((group) => group.name.startsWith('Unavailable'))],
        ]
    }

    function getHeirloomBonus(groupName: string, level: number, maxUpgrade: number): string {
        return heirloomBonusIds[groupName]
            ? heirloomBonusIds[groupName][level]
            : heirloomBonusIds['default'][5 - maxUpgrade + (level)]
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .collection-v2-section {
        --column-count: 1;
        --column-gap: 1rem;
        --column-width: 18rem;

        width: 18.75rem;
        
        @media screen and (min-width: 830px) {
            --column-count: 2;
            width: 37.75rem;
        }
        @media screen and (min-width: 1135px) {
            --column-count: 3;
            width: 56.75rem;
        }
        @media screen and (min-width: 1440px) {
            --column-count: 4;
            width: 75.75rem;
        }
        @media screen and (min-width: 1745) {
            --column-count: 5;
            width: 94.75rem;
        }
    }
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

<div class="wrapper">
    <div class="collection thing-container">
        {#each sections as [name, groups]}
            <SectionTitle
                count={$lazyStore.heirlooms[name.toUpperCase()]}
                title={name}
            />
            <div class="collection-v2-section">
                {#each groups as group}
                    {@const groupCount = $lazyStore.heirlooms[group.name]}
                    <div class="collection-v2-group">
                        <h4 class="drop-shadow text-overflow {getPercentClass(groupCount.percent)}">
                            {group.name.replace('Unavailable - ', '')}
                            <Count counts={groupCount} />
                        </h4>

                        <div class="collection-objects">
                            {#each group.items as item}
                                {@const level = $userStore.heirlooms?.[item.itemId]}
                                <div
                                    class="collection-object quality7"
                                    class:missing={level === undefined}
                                >
                                    <WowheadLink
                                        type="item"
                                        id={item.itemId}
                                        extraParams={{
                                            bonus: getHeirloomBonus(group.name, level || 0, item.maxUpgrade)
                                        }}
                                    >
                                        <WowthingImage
                                            name="item/{item.itemId}"
                                            size={48}
                                            border={2}
                                        />
                                    </WowheadLink>

                                    {#if level !== undefined}
                                        <div class="pill {getPercentClass(level / item.maxUpgrade * 100)}">
                                            {level} / {item.maxUpgrade}
                                        </div>

                                        {#if level === item.maxUpgrade}
                                            <div class="collected-icon drop-shadow">
                                                <IconifyIcon icon={mdiCheckboxOutline} />
                                            </div>
                                        {/if}
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
