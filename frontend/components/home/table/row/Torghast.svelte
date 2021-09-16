<script lang="ts">
    import toPairs from 'lodash/toPairs'

    import { Constants } from '@/data/constants'
    import {timeStore} from '@/stores'
    import type {Character} from '@/types'
    import {getNextWeeklyReset} from '@/utils/get-next-reset'
    import { tippyComponent } from '@/utils/tippy'

    import TooltipTorghast from '@/components/tooltips/torghast/TooltipTorghast.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    // [name, floorCompleted][]
    let wings: [string, number][]
    $: {
        wings = []
        if (character.weekly?.torghast) {
            wings = toPairs(character.weekly.torghast)
            wings.sort()

            // Reset wings to 0 if expired
            const resetTime = getNextWeeklyReset(character.weekly.torghastScannedAt, character.realm.region)
            if (resetTime > $timeStore) {
                for (const wing of wings) {
                    wing[0] = 'Unknown'
                    wing[1] = 0
                }
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-torghast);
    }
    span {
        &.separator {
            color: #888;
            padding-left: 0.2rem;
        }
        &.wing {
            display: inline-block;
            text-align: right;
            width: 1.3rem;
        }
    }
</style>

{#if wings.length === 2}
    <td use:tippyComponent={{component: TooltipTorghast, props: {character, wings}}}>
        <div class="flex-wrapper">
            <WowthingImage name={Constants.icons.torghast} size={20} border={1} />
            <div class="flex-wrapper">
                <span class="wing" class:status-success={wings[0][1] >= Constants.maxTorghastWing}>{wings[0][1]}</span>
                <span class="separator">/</span>
                <span class="wing" class:status-success={wings[1][1] >= Constants.maxTorghastWing}>{wings[1][1]}</span>
            </div>
        </div>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
