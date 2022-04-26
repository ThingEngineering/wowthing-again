<script lang="ts">
    import { DateTime } from 'luxon'

    import { Constants } from '@/data/constants'
    import { iconStrings } from '@/data/icons'
    import { timeStore, userQuestStore } from '@/stores'
    import { getNextDailyResetFromTime } from '@/utils/get-next-reset'
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

            for (let i = 0; i < callingCompleted.length; i++) {
                if (callingCompleted[i]) {
                    const expires = DateTime.fromSeconds(callingExpires[i], {zone: 'utc'})
                    if (expires > $timeStore) {
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
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-callings);

        border-left: 1px solid $border-color;
    }
</style>

<td>
    {#if character.level === Constants.characterMaxLevel}
        <div class="flex-wrapper">
            {#each callings as calling}
                <IconifyIcon
                    extraClass="{calling ? 'status-success' : 'status-fail'}"
                    icon={calling ? iconStrings.yes : iconStrings.no}
                    scale="0.91"
                />
            {/each}
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
