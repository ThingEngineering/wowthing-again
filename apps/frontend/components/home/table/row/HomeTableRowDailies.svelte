<script lang="ts">
    import { DateTime } from 'luxon'

    import { iconStrings } from '@/data/icons'
    import { dailyQuestLevel, globalDailyQuests } from '@/data/quests'
    import { timeStore, userQuestStore, userStore } from '@/stores'
    import { getNextDailyResetFromTime } from '@/utils/get-next-reset'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, DailyQuestsReward } from '@/types'
    import type { GlobalDailyQuest } from '@/types/data'

    import IconifyIcon from '@/shared/images/IconifyIcon.svelte'
    import Tooltip from '@/components/tooltips/dailies/TooltipDailies.svelte'

    export let character: Character
    export let expansion: number

    let callings: [DailyQuestsReward, GlobalDailyQuest, boolean][]
    let resets: DateTime[]
    $: {
        callings = [[null, null, false], [null, null, false], [null, null, false]]

        resets = [
            getNextDailyResetFromTime($timeStore, character.realm.region),
        ]
        resets.push(resets[0].plus({ days: 1 }))
        resets.push(resets[0].plus({ days: 2 }))

        const globalDailies = $userStore.globalDailies[`${expansion}-${character.realm.region}`]
        if (globalDailies) {
            for (let questIndex = 0; questIndex < globalDailies.questIds.length; questIndex++) {
                const questId = globalDailies.questIds?.[questIndex]
                const expires = globalDailies.questExpires?.[questIndex]
                const rewards = globalDailies.questRewards?.[questIndex]

                for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                    const reset = resets[resetIndex]
                    if (reset.toUnixInteger() === expires) {
                        callings[resetIndex][0] = rewards
                        callings[resetIndex][1] = globalDailyQuests[questId]
                        break
                    }
                }
            }
        }

        const dailies = $userQuestStore.characters[character.id]?.dailies?.[expansion]
        if (dailies) {
            for (let i = 0; i < dailies[0].length; i++) {
                if (dailies[0][i]) {
                    const expires = DateTime.fromSeconds(dailies[1][i], {zone: 'utc'})
                    if (expires > $timeStore) {
                        for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                            if (expires <= resets[resetIndex]) {
                                callings[resetIndex][2] = true
                                break
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

        border-left: 1px solid $border-color;
    }
</style>

{#if character.level >= dailyQuestLevel[expansion]}
    <td
        use:tippyComponent={{
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
                <IconifyIcon
                    extraClass="{status ? 'status-success' : 'status-fail'}"
                    icon={status ? iconStrings.yes : iconStrings.no}
                />
            {/each}
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
