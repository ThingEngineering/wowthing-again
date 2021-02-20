<script lang="ts">
    import {afterUpdate} from 'svelte'

    import GearItems from './GearItems.svelte'
    import CharacterTable from '../common/CharacterTable.svelte'
    import CharacterRowItemLevel from '../common/CharacterRowItemLevel.svelte'

    afterUpdate(() => {
        if (window.__tip) {
            window.__tip.watchElligibleElements()
        }
    })
</script>

<CharacterTable>
    <slot slot="rowExtra">
        <CharacterRowItemLevel />
        <GearItems />
    </slot>
</CharacterTable>
