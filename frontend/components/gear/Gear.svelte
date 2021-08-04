<script lang="ts">
    import { afterUpdate } from 'svelte'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './TableRowItems.svelte'

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()
    })
</script>

<CharacterTable>
    <svelte:fragment slot="rowExtra">
        <RowItemLevel />
        <RowItems />
    </svelte:fragment>
</CharacterTable>
