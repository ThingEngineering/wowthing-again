<script lang="ts">
    import { ItemBonusType } from '@/enums/item-bonus-type';
    import { wowthingData } from '@/shared/stores/data';
    import { exploreState } from '@/stores/local-storage';

    import TextInput from '@/shared/components/forms/TextInput.svelte';
</script>

<style lang="scss">
    .thing-container {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 1rem;
        width: 100%;

        :global(input) {
            margin-bottom: 1rem;
            width: 40rem;
        }
    }
    .bonuses {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    .bonus {
        border: 1px solid $border-color;
        width: 18rem;
    }
    h4 {
        background: $highlight-background;
        border-bottom: 1px solid $border-color;
        padding: 0.2rem 0;
        text-align: center;
    }
    table {
        border-top: 1px solid $border-color;
        padding: 1rem 0.5rem;
        width: 100%;

        tr:first-child td {
            border-top: 1px solid $border-color;
        }
    }
    td {
        padding: 0.2rem 0.4rem;
    }
</style>

<div class="thing-container border">
    <TextInput name="explore_bonus_ids" bind:value={$exploreState.bonusIds} />

    <div class="bonuses">
        {#each $exploreState.bonusIds.split(':') as bonusIdString}
            {@const bonusId = parseInt(bonusIdString)}
            {@const bonus = wowthingData.items.itemBonuses[bonusId]}
            <div class="bonus">
                <h4>{bonusId}</h4>
                {#if bonus}
                    <div>Type Flags: {bonus.typeFlags}</div>
                    <table class="table table-striped">
                        <tbody>
                            {#each bonus.bonuses as [bonusType, ...bonusValues]}
                                {@const bonusTypeName = ItemBonusType[bonusType]}
                                <tr>
                                    <td class="type">
                                        [{bonusType}] {bonusTypeName || `???`}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="values">
                                        {bonusValues}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    ???
                {/if}
            </div>
        {/each}
    </div>
</div>
