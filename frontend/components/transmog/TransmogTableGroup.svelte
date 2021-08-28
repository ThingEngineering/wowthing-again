<script lang="ts">
    import type {TransmogDataGroup} from '@/types/data'

    import TransmogTableSet from './TransmogTableSet.svelte'

    export let group: TransmogDataGroup
</script>

<style lang="scss">
    .name {
        padding: 0 1rem;
    }
</style>

<tr>
    <td class="name" colspan="13">&ndash; {group.name}</td>
</tr>

{#each group.sets as setName, setIndex}
    <tr>
        <td class="name">&ndash;&ndash; {setName}</td>

        {#if group.type === 'all'}
            <TransmogTableSet set={group.data['all'][setIndex]} span={12} />
        {:else if group.type === 'armor'}
            <TransmogTableSet set={group.data['cloth'][setIndex]} span={3} />
            <TransmogTableSet set={group.data['leather'][setIndex]} span={4} />
            <TransmogTableSet set={group.data['mail'][setIndex]} span={2} />
            <TransmogTableSet set={group.data['plate'][setIndex]} span={3} />
        {:else if group.type === 'class'}
            <TransmogTableSet set={group.data['mage'][setIndex]} />
            <TransmogTableSet set={group.data['priest'][setIndex]} />
            <TransmogTableSet set={group.data['warlock'][setIndex]} />
            <TransmogTableSet set={group.data['demon-hunter'][setIndex]} />
            <TransmogTableSet set={group.data['druid'][setIndex]} />
            <TransmogTableSet set={group.data['monk'][setIndex]} />
            <TransmogTableSet set={group.data['rogue'][setIndex]} />
            <TransmogTableSet set={group.data['hunter'][setIndex]} />
            <TransmogTableSet set={group.data['shaman'][setIndex]} />
            <TransmogTableSet set={group.data['death-knight'][setIndex]} />
            <TransmogTableSet set={group.data['paladin'][setIndex]} />
            <TransmogTableSet set={group.data['warrior'][setIndex]} />
        {/if}
    </tr>
{/each}
