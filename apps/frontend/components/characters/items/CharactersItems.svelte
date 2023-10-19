<script lang="ts">
    import { ItemLocation } from '@/enums/item-location'
    import type { Character } from '@/types'

    import Location from './CharactersItemsLocation.svelte'

    export let character: Character
</script>

<style lang="scss">
    .collection {
        border-width: 0;
        display: flex;
        gap: 1rem;
    }
</style>

<div class="collection">
    <Location
        location={ItemLocation.Bags}
        {character}
    />
    <Location
        location={ItemLocation.Bank}
        {character}
    />
</div>
