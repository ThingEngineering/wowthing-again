<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { iconStrings } from '@/data/icons'
    import { globalDailyQuests } from '@/data/quests'
    import { timeStore, userQuestStore, userStore } from '@/stores'
    import { getNextDailyResetFromTime } from '@/utils/get-next-reset'
    import type { Character } from '@/types'
    import type { GlobalDailyQuest } from '@/types/data'
    import { tippyComponent } from '@/utils/tippy'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Tooltip from '@/components/tooltips/callings/TooltipCallings.svelte'

    export let character: Character

    let callings: [GlobalDailyQuest, boolean][]
    $: {
        callings = [[null, false], [null, false], [null, false]]

        const resets = [
            getNextDailyResetFromTime($timeStore, character.realm.region),
        ]
        resets.push(resets[0].plus({ days: 1 }))
        resets.push(resets[0].plus({ days: 2 }))

        const dailies = $userStore.data.dailies[`8-${character.realm.region}`]
        if (dailies) {
            for (let questIndex = 0; questIndex < dailies.questIds.length; questIndex++) {
                const questId = dailies.questIds[questIndex]
                const expires = dailies.questExpires[questIndex]

                for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                    const reset = resets[resetIndex]
                    if (reset.toUnixInteger() === expires) {
                        callings[resetIndex][0] = globalDailyQuests[questId]
                        break
                    }
                }
            }
        }

        if ($userQuestStore.data.characters[character.id]?.callingCompleted?.length > 0) {
            const callingCompleted: boolean[] = $userQuestStore.data.characters[character.id].callingCompleted
            const callingExpires: number[] = $userQuestStore.data.characters[character.id].callingExpires

            for (let i = 0; i < callingCompleted.length; i++) {
                if (callingCompleted[i]) {
                    const expires = DateTime.fromSeconds(callingExpires[i], {zone: 'utc'})
                    if (expires > $timeStore) {
                        for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                            if (expires <= resets[resetIndex]) {
                                callings[resetIndex][1] = true
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

        border-left: 1px solid $border-color;
    }
</style>

{#if character.level === Constants.characterMaxLevel}
    <td
        use:tippyComponent={{
            component: Tooltip,
            props: {character, callings},
        }}
    >
        <div class="flex-wrapper">
            {#each callings as [daily, status]}
                <IconifyIcon
                    extraClass="{status ? 'status-success' : 'status-fail'}"
                    icon={status ? iconStrings.yes : iconStrings.no}
                    scale="0.91"
                />
            {/each}
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
