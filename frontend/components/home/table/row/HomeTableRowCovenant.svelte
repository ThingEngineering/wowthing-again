<script lang="ts">
    import { Constants } from '@/data/constants'
    import { covenantMap } from '@/data/covenant'
    import type { Character, Covenant } from '@/types'
    //import getCurrentPeriodForCharacter from '@/utils/get-current-period-for-character'
    import { tippyComponent } from '@/utils/tippy'

    import Tooltip from '@/components/tooltips/covenant/TooltipCovenant.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character = undefined

    let covenant: Covenant
    $: {
        /*const currentPeriod = getCurrentPeriodForCharacter(character)
        if (currentPeriod) {
            maxRenown = Math.min(80, maxRenown + (currentPeriod.id - 815) * 2)
        }*/

        covenant = covenantMap[character?.shadowlands?.covenantId]
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-covenant);

        justify-content: space-between;
    }
</style>

<td
    use:tippyComponent={{
        component: Tooltip,
        props: { character },
    }}
>
    {#if covenant !== undefined}
        <div class="flex-wrapper">
            <WowthingImage name={covenant.icon} size={20} border={1} />
            <span
                class:status-success={character.shadowlands.renownLevel >= Constants.maxRenown}
            >{character.shadowlands.renownLevel}</span>
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
