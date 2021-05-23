<script lang="ts">
    import {afterUpdate} from 'svelte'

    import CharacterTable from '../common/character-table/Table.svelte'
    import GearItems from './TableRowItems.svelte'
    import RowItemLevel from '../common/character-table/row/ItemLevel.svelte'

    afterUpdate(() => {
        if (window.__tip) {
            window.__tip.watchElligibleElements()
        }
    })
</script>

<CharacterTable>
    <slot slot="rowExtra">
        <RowItemLevel />
        <GearItems />
    </slot>
</CharacterTable>
