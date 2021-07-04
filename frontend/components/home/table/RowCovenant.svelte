<script lang="ts">
    import { getContext } from 'svelte'

    import { covenantMap } from '@/data/covenant'
    import { data as staticData } from '@/stores/static'
    import { data as userData } from '@/stores/user'
    import type { Character, Covenant } from '@/types'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

    let covenant: Covenant
    let maxRenown = 40
    let tooltip: string
    $: {
        covenant = covenantMap[character.shadowlands?.covenantId]
        if (covenant) {
            tooltip = covenant.getTooltip(character.shadowlands.renownLevel)

            const regionId = $staticData.realms[character.realmId]?.region || 1
            maxRenown += ($userData.currentPeriod[regionId].id - 808) * 2
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
