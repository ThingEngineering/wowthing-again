<script lang="ts">
    import { afterUpdate } from 'svelte'

    import CharacterTable from '@/components/character-table/Table.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './TableRowItems.svelte'

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()
    })
</script>

<CharacterTable>
    <slot slot="rowExtra">
        <RowItemLevel />
        <RowItems />
    </slot>
</CharacterTable>
