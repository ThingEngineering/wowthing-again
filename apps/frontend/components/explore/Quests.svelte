<script lang="ts">
    import { QuestStatus } from '@/enums/quest-status';
    import { browserState } from '@/shared/state/browser.svelte';
    import { userState } from '@/user-home/state/user';
    import type { Character } from '@/types';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';

    let filterFunc = $derived((char: Character) => {
        const charQuests = userState.quests.characterById.get(char.id);
        return (
            charQuests.hasQuestById.has(browserState.current.explore.questId) ||
            charQuests.progressQuestByKey.get(`q${browserState.current.explore.questId}`)
                ?.status === QuestStatus.InProgress
        );
    });
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

        :global(svg) {
            --scale: 0.9 !important;
        }
    }
</style>

<div class="thing-container border">
    <NumberInput
        name="explore_quest_id"
        minValue={0}
        maxValue={999999}
        bind:value={browserState.current.explore.questId}
    />

    <CharacterTable {filterFunc}>
        <svelte:fragment slot="rowExtra" let:character>
            <td>
                {#if userState.quests.characterById
                    .get(character.id)
                    ?.hasQuestById?.has(browserState.current.explore.questId)}
                    <span class="status-success">
                        <ParsedText text=":starFull:" />
                    </span>
                {:else}
                    <span class="status-shrug">
                        <ParsedText text=":starHalf:" />
                    </span>
                {/if}
            </td>
        </svelte:fragment>

        <tr slot="emptyRow">
            <td colspan="999">You have no characters with this quest completed.</td>
        </tr>
    </CharacterTable>
</div>
