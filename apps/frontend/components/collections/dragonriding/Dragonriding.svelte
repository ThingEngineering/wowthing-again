<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { itemStore, lazyStore, manualStore, userQuestStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'

    import Manuscript from './DragonridingManuscript.svelte'
    import Options from './DragonridingOptions.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
</script>

<div class="resizer-view">
    <Options />

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
                                <Manuscript
                                    {itemId}
                                    {questId}
                                />
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
