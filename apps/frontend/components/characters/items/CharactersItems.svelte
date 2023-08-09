<script lang="ts">
    import { ItemLocation } from '@/enums'
    import type { Character } from '@/types'

    import Location from './CharactersItemsLocation.svelte'

    export let character: Character
</script>

<style lang="scss">

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
