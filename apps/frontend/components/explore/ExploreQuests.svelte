<script lang="ts">
    import { exploreState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
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
        filterFunc={(char) =>
            userState.quests.characterById.get(char.id).hasQuestById.has($exploreState.questId)}
    >
        <svelte:fragment slot="rowExtra">
            <td>✔</td>
        </svelte:fragment>

        <tr slot="emptyRow">
            <td colspan="999">You have no characters with this quest completed.</td>
        </tr>
    </CharacterTable>
</div>
