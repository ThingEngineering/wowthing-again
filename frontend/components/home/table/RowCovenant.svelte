<script lang="ts">
    import { getContext } from 'svelte'

    import { covenantMap } from '@/data/covenant'
    import type { Character, Covenant } from '@/types'
    import getCurrentPeriodForCharacter from '@/utils/get-current-period-for-character'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character = undefined

    let covenant: Covenant
    let maxRenown = 60
    let tooltip: string
    $: {
        if (!character) {
            character = getContext('character')
        }

        const currentPeriod = getCurrentPeriodForCharacter(character)
        if (currentPeriod) {
            maxRenown = Math.min(80, maxRenown + (currentPeriod.id - 815) * 2)
        }

        covenant = covenantMap[character?.shadowlands?.covenantId]
        if (covenant) {
            tooltip = covenant.getTooltip(character?.shadowlands.renownLevel)
            const currentPeriod = getCurrentPeriodForCharacter(character)
            if (currentPeriod) {
                maxRenown += (currentPeriod.id - 815) * 2
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-covenant);

        justify-content: space-between;
    }
</style>

<td use:tippy={tooltip}>
    {#if covenant !== undefined}
        <div class="flex-wrapper">
            <WowthingImage name={covenant.Icon} size={20} border={1} />
            <span class:status-success={character.shadowlands.renownLevel >= maxRenown}>{character.shadowlands.renownLevel}</span>
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
