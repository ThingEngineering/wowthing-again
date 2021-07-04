<script lang="ts">
    import toPairs from 'lodash/toPairs'

    import { Constants } from '@/data/constants'
    import type {Character} from '@/types'
    import { tippyComponent } from '@/utils/tippy'

    import TorghastTooltip from '@/tooltips/torghast/Tooltip.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    // wing1, wing2?
    let wings: [string, number][] = []
    $: {
        if (character.weekly?.torghast) {
            wings = toPairs(character.weekly.torghast)
            wings.sort()
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
    <td use:tippyComponent={{component: TorghastTooltip, props: {character, wings}}}>
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
