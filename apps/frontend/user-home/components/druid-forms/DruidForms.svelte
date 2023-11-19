<script lang="ts">
    import { lazyStore, manualStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'

    // import Options from './DragonridingOptions.svelte'
    import Item from './Item.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
    }
</style>

<div class="resizer-view">
    <!-- <Options /> -->

    <div class="collection thing-container">
        <SectionTitle
            count={$lazyStore.druidForms['OVERALL']}
            title={'Druid Forms'}
        />
        <div class="collection-section">
            {#each $manualStore.druidForms as group}
                <div class="collection-group">
                    <h4 class={getPercentClass($lazyStore.druidForms[group.name].percent)}>
                        <ParsedText text={group.name} />
                    </h4>
                    <div class="collection-objects">
                        {#each group.items as {itemId, questId}}
                            <Item {itemId} {questId} />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
