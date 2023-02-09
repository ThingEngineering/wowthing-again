<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { itemStore, lazyStore, manualStore, userQuestStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
</script>

<div class="resizer-view">
    <div class="collection thing-container">
        {#each $manualStore.dragonriding as category}
            <SectionTitle
                count={$lazyStore.dragonriding[category.name]}
                title={category.name}
            />
            <div class="collection-section">
                {#each category.groups as group}
                    <div class="collection-group">
                        <h4 class={getPercentClass($lazyStore.dragonriding[`${category.name}--${group.name}`].percent)}>
                            {group.name}
                        </h4>
                        <div class="collection-objects">
                            {#each group.things as {itemId, questId}}
                                {@const item = $itemStore.items[itemId]}
                                {@const userHas = $userQuestStore.accountHas?.has(questId)}
                                <div
                                    class="collection-object quality{item.quality}"
                                    class:missing={userHas}
                                >
                                    <WowheadLink
                                        type="item"
                                        id={itemId}
                                    >
                                        <WowthingImage
                                            name="item/{itemId}"
                                            size={48}
                                            border={2}
                                        />
                                    </WowheadLink>

                                    {#if userHas}
                                        <div class="collected-icon drop-shadow">
                                            <IconifyIcon icon={mdiCheckboxOutline} />
                                        </div>
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
