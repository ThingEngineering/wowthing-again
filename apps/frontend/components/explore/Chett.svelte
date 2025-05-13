<script lang="ts">
    import { userQuestStore, userStore } from '@/stores';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import type { Character } from '@/types';

    import CharacterTable from '../character-table/CharacterTable.svelte';
    import CharacterTableHead from '../character-table/CharacterTableHead.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    const questTiers: [number, string][][] = [
        [
            [87302, 'Rares'], // 3x Rare Mob
            [87307, 'Trash'], // 25x Trash Can/Dumpster
        ],
        [
            [86919, 'Gig'], // Side Gig
            [86918, 'Scrap'], // 100x Empty Can
            [87306, 'Boost'], // 50x Car Can
            [87305, 'Race'], // 2x Car Race
            [87303, 'SS'], // Sidestreet Sluice delve
        ],
        [
            [86917, 'Jobs'], // 10x Delivery Job
            [86920, 'WM'], // 5x War Mode Kill
            [86923, 'Fish'], // 50x Runoff Fishing
            [86924, 'Pets'], // 5x Battle Pet
            [87304, 'ES9'], // Excavation Site 9 delve
        ],
    ];

    const sortFunc = $getCharacterSortFunc((char: Character) => {
        const tiers = [0, 0, 0];
        let done = 0;
        questTiers.forEach((questTier, index) => {
            for (const [questId] of questTier) {
                const completed = userQuestStore.characterHas(char.id, questId);
                const prog = $userQuestStore.characters[char.id]?.progressQuests?.[`q${questId}`];
                if (completed) {
                    done++;
                }
                if (completed || prog) {
                    tiers[index]++;
                }
            }
        });
        if (done === 3) {
            return '9';
        } else if (tiers[0] === 2 && tiers[1] >= 1) {
            return '0';
        } else if (tiers[0] === 1 && tiers[1] >= 2) {
            return '1';
        } else if (tiers[0] === 1) {
            return '2';
        } else {
            return '8';
        }
    });
</script>

<style lang="scss">
    td {
        --width: 3rem;
    }
</style>

<CharacterTable filterFunc={(char) => char.level === 80} {sortFunc}>
    <CharacterTableHead slot="head">
        <th class="spacer"></th>
        <th class="sized b-l">List</th>
        {#each questTiers as questTier}
            <th class="spacer"></th>
            {#each questTier as [, title]}
                <th class="sized b-l">{title}</th>
            {/each}
        {/each}
    </CharacterTableHead>

    <svelte:fragment slot="rowExtra" let:character>
        {@const gotList = userQuestStore.characterHas(character.id, 87296)}
        <td class="spacer"></td>
        <td
            class="sized c"
            class:status-success={!gotList}
            class:status-fail={gotList}
            style:--width={'1.6rem'}
        >
            <YesNoIcon state={userQuestStore.characterHas(character.id, 87296)} />
        </td>
        {#each questTiers as questTier, index}
            <td class="spacer"></td>
            {#each questTier as [questId]}
                {@const completed = userQuestStore.characterHas(character.id, questId)}
                {@const progressQuest =
                    $userQuestStore.characters[character.id]?.progressQuests?.[`q${questId}`]}
                <td
                    class="sized c b-l"
                    class:status-success={index === 0}
                    class:status-shrug={index === 1}
                    class:status-fail={index === 2}
                >
                    {#if completed}
                        <YesNoIcon state={true} />
                    {:else if !!progressQuest}
                        <YesNoIcon state={false} />
                    {/if}
                </td>
            {/each}
        {/each}
    </svelte:fragment>
</CharacterTable>
