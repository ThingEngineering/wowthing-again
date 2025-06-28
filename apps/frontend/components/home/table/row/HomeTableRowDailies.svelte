<script lang="ts">
    import { DateTime } from 'luxon';

    import { dailyQuestLevel, globalDailyQuests } from '@/data/quests';
    import { userQuestStore, userStore } from '@/stores';
    import { timeStore } from '@/shared/stores/time';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { getNextDailyResetFromTime } from '@/utils/get-next-reset';
    import type { Character, DailyQuestsReward } from '@/types';
    import type { GlobalDailyQuest } from '@/types/data';

    import Tooltip from '@/components/tooltips/dailies/TooltipDailies.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    export let character: Character;
    export let expansion: number;

    let callings: [DailyQuestsReward, GlobalDailyQuest, boolean][];
    let resets: DateTime[];
    $: {
        callings = [
            [null, null, false],
            [null, null, false],
            [null, null, false],
        ];

        resets = [getNextDailyResetFromTime($timeStore, character.realm.region)];
        resets.push(resets[0].plus({ days: 1 }));
        resets.push(resets[0].plus({ days: 2 }));

        const globalDailies = $userStore.globalDailies[`${expansion}-${character.realm.region}`];
        if (globalDailies) {
            for (let questIndex = 0; questIndex < globalDailies.questIds.length; questIndex++) {
                const questId = globalDailies.questIds?.[questIndex];
                const expires = globalDailies.questExpires?.[questIndex];
                const rewards = globalDailies.questRewards?.[questIndex];

                for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                    const reset = resets[resetIndex];
                    if (reset.toUnixInteger() === expires) {
                        callings[resetIndex][0] = rewards;
                        callings[resetIndex][1] = globalDailyQuests[questId];
                        break;
                    }
                }
            }
        }

        const dailies = $userQuestStore.characters[character.id]?.dailies?.[expansion];
        if (dailies) {
            for (let i = 0; i < dailies[0].length; i++) {
                if (dailies[0][i]) {
                    const expires = DateTime.fromSeconds(dailies[1][i], { zone: 'utc' });
                    if (expires > $timeStore) {
                        for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                            if (expires <= resets[resetIndex]) {
                                callings[resetIndex][2] = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-callings);

        --scale: 0.91;

        border-left: 1px solid var(--border-color);
    }
</style>

{#if character.level >= dailyQuestLevel[expansion]}
    <td
        use:componentTooltip={{
            component: Tooltip,
            props: {
                callings,
                character,
                expansion,
                resets,
            },
        }}
    >
        <div class="flex-wrapper">
            {#each callings as [, , status]}
                <YesNoIcon extraClass={status ? 'status-success' : 'status-fail'} state={status} />
            {/each}
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
