<script lang="ts">
    import { getContext } from 'svelte'

    import { covenantMap } from '@/data/covenant'
    import type { Character, Covenant } from '@/types'
    import tippy from '@/utils/tippy'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

    let covenant: Covenant
    let tooltip: string
    $: {
        covenant = covenantMap[character.shadowlands?.covenantId]
        if (covenant) {
            tooltip = covenant.getTooltip(character.shadowlands.renownLevel)
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($character-width-covenant);

        justify-content: space-between;
    }
</style>

<td use:tippy={tooltip}>
    {#if covenant !== undefined}
        <div class="flex-wrapper">
            <WowthingImage name={covenant.Icon} size={20} border={1} />
            <span>{character.shadowlands.renownLevel}</span>
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
