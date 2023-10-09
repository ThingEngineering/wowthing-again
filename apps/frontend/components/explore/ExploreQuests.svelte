<script lang="ts">
    import { userQuestStore } from '@/stores'
    import { exploreState } from '@/stores/local-storage'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import NumberInput from '@/shared/forms/NumberInput.svelte'
</script>

<style lang="scss">
    .thing-container {
        padding: 1rem;
        width: 100%;

        :global(input) {
            margin-bottom: 1rem;
            width: 10rem;
        }
    }
    td {
        padding: 0.3rem 0.5rem;
    }
</style>

<div class="thing-container border">
    <NumberInput
        name="explore_quest_id"
        minValue={0}
        maxValue={999999}
        bind:value={$exploreState.questId}
    />

    <CharacterTable
        filterFunc={(char) => userQuestStore.hasAny(char.id, $exploreState.questId)}
    >
        <svelte:fragment slot="rowExtra">
            <td>✔</td>
        </svelte:fragment>
        
        <tr slot="emptyRow">
            <td colspan="999">You have no characters with this quest completed.</td>
        </tr>
    </CharacterTable>
</div>
