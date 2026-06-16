<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import { delveMap } from '@/data/delve';

    import NumberInput from '@/shared/components/forms/NumberInput.svelte';

    const delves = sortBy(getNumberKeyedEntries(delveMap), ([, delve]) => delve.shortName);
</script>

<style lang="scss">
    .delves {
        break-inside: avoid;
        columns: 2;
        column-gap: 1.5rem;
    }
    .delve {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;

        :global(fieldset) {
            margin: 0;
        }
        :global(input) {
            margin: 0;
            padding-bottom: 0.1rem;
            padding-top: 0.1rem;
        }
    }
</style>

<div class="settings-block">
    <h2>Delves</h2>

    <div class="delves">
        {#each delves as [poiId, delve] (poiId)}
            {@const stories = sortBy(Object.keys(delve.storyRanks))}
            <div class="delve">
                <h3>{delve.name}</h3>
                {#each stories as story (story)}
                    {@const storyKey = `${poiId}:${story}`}
                    <div class="flex-wrapper">
                        <div class="name quality{settingsState.value.delveRankings[storyKey]}">
                            {story}
                        </div>
                        <div class="ranking">
                            <NumberInput
                                name="minimum_level"
                                minValue={0}
                                maxValue={5}
                                bind:value={settingsState.value.delveRankings[storyKey]}
                            />
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>
