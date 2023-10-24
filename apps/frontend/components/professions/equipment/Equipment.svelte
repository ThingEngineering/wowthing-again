<script lang="ts">
    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import Row from './TableRow.svelte'
</script>

<CharacterTable skipIgnored={true}>
    <svelte:fragment slot="rowExtra" let:character>
        <Row {character} />
    </svelte:fragment>
</CharacterTable>
