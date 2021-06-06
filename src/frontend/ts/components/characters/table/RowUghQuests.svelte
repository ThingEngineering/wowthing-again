<script lang="ts">
    import {getContext} from 'svelte'

    import type {Character} from '@/types'
    import tippy from '@/utils/tippy'

    import RowUghQuest from './RowUghQuest.svelte'
    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')
    const anima = character.weekly?.ughQuests?.['anima']
    const souls = character.weekly?.ughQuests?.['souls']
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

{#if anima}
    <TableIcon>
        <WowthingImage name="spell/341209" size={20} border={1} />
    </TableIcon>
    <RowUghQuest ughQuest={anima} />
{:else}
    <TableIcon />
    <td></td>
{/if}

{#if souls}
    <TableIcon>
        <WowthingImage name="spell/225100" size={20} border={1} />
    </TableIcon>
    <RowUghQuest ughQuest={souls} />
{:else}
    <TableIcon />
    <td></td>
{/if}
