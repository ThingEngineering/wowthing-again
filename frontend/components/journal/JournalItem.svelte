<script lang="ts">
    import { difficultyMap, journalDifficultyOrder } from '@/data/difficulty'
    import { userTransmogStore } from '@/stores'
    import type { JournalDataEncounterItem } from '@/types/data/journal'

    import ItemLink from '@/components/links/ItemLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let item: JournalDataEncounterItem
</script>

<style lang="scss">
    .appearance {
        --image-border-width: 2px;

        margin-bottom: 0.5rem;
        margin-right: 0.25rem;
        position: relative;

        &.thing-yes {
            --image-border-color: #44aa44;
        }
        &.thing-no {
            opacity: 0.5;
        }
    }
    .difficulties {
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);

        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        display: inline-flex;
        //font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
    }
</style>

{#each item.appearances as appearance}
    <div class="appearance thing-{$userTransmogStore.data.userHas[appearance.appearanceId] ? 'yes' : 'no'}">
        <ItemLink
            id={item.id}
        >
            <WowthingImage
                name="item/{item.id}"
                size={48}
                border={2}
            />
        </ItemLink>

        <div class="difficulties">
            {#each journalDifficultyOrder as difficulty}
                {#if appearance.difficulties.indexOf(difficulty) >= 0}
                    <span>{difficultyMap[difficulty].shortName}</span>
                {/if}
            {/each}
        </div>
    </div>
{/each}
