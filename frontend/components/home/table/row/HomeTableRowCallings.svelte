<script lang="ts">
    import iconComplete from '@iconify/icons-mdi/check'
    import iconIncomplete from '@iconify/icons-mdi/close'
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { timeStore, userQuestStore } from '@/stores'
    import { getNextDailyResetFromTime } from '@/utils/get-next-reset'
    import parseApiTime from '@/utils/parse-api-time'
    import type { Character } from '@/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'

    export let character: Character

    let callings: boolean[]
    $: {
        callings = [false, false, false]

        if ($userQuestStore.data.characters[character.id]?.callingCompleted?.length > 0) {
            const callingCompleted: boolean[] = $userQuestStore.data.characters[character.id].callingCompleted
            const callingExpires: number[] = $userQuestStore.data.characters[character.id].callingExpires

            const resets = [
                getNextDailyResetFromTime($timeStore, character.realm.region),
            ]
            resets.push(resets[0].plus({ days: 1 }))
            resets.push(resets[0].plus({ days: 2 }))
            console.log(character.name, resets)

            for (let i = 0; i < callingCompleted.length; i++) {
                if (callingCompleted[i]) {
                    const expires = DateTime.fromSeconds(callingExpires[i])
                    for (let resetIndex = 0; resetIndex < resets.length; resetIndex++) {
                        if (expires < resets[resetIndex]) {
                            callings[resetIndex] = true
                            break
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
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
    .complete {
        color: $colour-success;
    }
    .incomplete {
        color: $colour-fail;
    }
</style>

<td>
    {#if character.level === Constants.characterMaxLevel}
        {#each callings as calling}
            <span class="{calling ? 'complete' : 'incomplete'}">
                <IconifyIcon
                    icon={calling ? iconComplete : iconIncomplete}
                    scale={1.1}
                />
            </span>
        {/each}
    {:else}
        &nbsp;
    {/if}
</td>
