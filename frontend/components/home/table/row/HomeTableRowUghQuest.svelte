<script lang="ts">
    import { Constants } from '@/data/constants'
    import { timeStore } from '@/stores'
    import type { Character, CharacterWeeklyUghQuest } from '@/types'
    import { getNextWeeklyReset } from '@/utils/get-next-reset'
    import { toNiceNumber } from '@/utils/to-nice'

    export let character: Character
    export let cls: string = undefined
    export let ughQuest: CharacterWeeklyUghQuest
    export let weeklyReset = false

    let status = ''
    let text = ''
    let valid = true
    $: {
        if (character.level < Constants.characterMaxLevel || !ughQuest) {
            valid = false
        }
        else {
            const resetTime = getNextWeeklyReset(character.weekly.ughQuestsScannedAt, character.realm.region)
            if (weeklyReset) {
                // quest always resets at the end of the week and it's a new week
                if (resetTime < $timeStore) {
                    ughQuest.status = 0
                }
            }
            else {
                // quest was completed and it's a new week
                if (ughQuest.status === 2 && resetTime < $timeStore) {
                    ughQuest.status = 0
                }
            }

            if (ughQuest.status === 2) {
                status = 'success'
                text = 'Done'
            }
            else if (ughQuest.status === 1) {
                status = 'shrug'
                if (ughQuest.type === 'progressbar') {
                    text = `${ughQuest.have} %`
                } else {
                    text = `${toNiceNumber(ughQuest.have)} / ${toNiceNumber(ughQuest.need)}`
                }
                if (ughQuest.have === ughQuest.need) {
                    status = `${status} shrug-cycle`
                }
            }
            else {
                status = 'fail'
                text = 'Get!'
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-ugh-quest);

        border-left: 1px solid $border-color;
        word-spacing: -0.2ch;

        &.anima {
            @include cell-width($width-ugh-anima);
        }

        &.status-shrug {
            text-align: right;
        }

        &.shrug-cycle {
            animation: 2s linear 0s infinite alternate shrug-success;
        }
    }

    @keyframes shrug-success {
        0% {
            color: $colour-fail;
        }
        100% {
            color: $colour-shrug;
        }
    }
</style>

{#if valid}
    <td class="{cls} status-{status}">{text}</td>
{:else}
    <td>&nbsp;</td>
{/if}
