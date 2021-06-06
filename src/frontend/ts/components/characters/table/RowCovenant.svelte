<script lang="ts">
    import {getContext} from 'svelte'

    import {covenantMap} from '@/data/covenant'
    import type {Character} from '@/types'
    import tippy from '@/utils/tippy'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

    const covenant = character.shadowlands !== undefined ? covenantMap[character.shadowlands.covenantId] : undefined
</script>

<style lang="scss">
    @import 'scss/variables';

    td {
        padding-left: 0.1rem;
        padding-right: 0.7rem;
        text-align: right;
        width: 2.0rem;
    }
</style>

{#if covenant !== undefined}
    <TableIcon>
        <WowthingImage name={covenant.Icon} size={20} border={1} />
    </TableIcon>
    <td use:tippy={covenant.getTooltip(character.shadowlands.renownLevel)}>
        {character.shadowlands.renownLevel}
    </td>
{:else}
    <TableIcon>&nbsp;</TableIcon>
    <td>&nbsp;</td>
{/if}
