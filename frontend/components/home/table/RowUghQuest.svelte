<script lang="ts">
    import { Constants } from '@/data/constants'
    import {timeStore} from '@/stores'
    import type {Character, CharacterWeeklyUghQuest} from '@/types'
    import {getNextWeeklyReset} from '@/utils/get-next-reset'
    import {toNiceNumber} from '@/utils/to-nice'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let cls: string = undefined
    export let icon: string
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
            if (ughQuest && weeklyReset) {
                const resetTime = getNextWeeklyReset(character.weekly.ughQuestsScannedAt, character.realm.region)
                if (resetTime < $timeStore) {
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

        white-space: nowrap;
        word-spacing: -0.2ch;

        &.anima {
            @include cell-width($width-ugh-anima);
        }
    }

    span {
        display: inline-block;
        flex: 1;
        margin-left: 0.3rem;

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
    <td class="{cls}">
        <div class="flex-wrapper">
            <WowthingImage name={icon} size={20} border={1} />
            <span class="status-{status}">{text}</span>
        </div>
    </td>
{:else}
    <td></td>
{/if}
