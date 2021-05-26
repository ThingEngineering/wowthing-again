<script lang="ts">
    import {afterUpdate} from 'svelte'

    import CharacterTable from '@/components/common/character-table/Table.svelte'
    import RowItemLevel from '@/components/common/character-table/row/ItemLevel.svelte'
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
