<script lang="ts">
    import { ItemLocation } from '@/enums/item-location';
    import type { CharacterProps } from '@/types/props';

    import Location from './CharactersItemsLocation.svelte';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    .collection {
        border-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="collection">
    <Location location={ItemLocation.Bags} {character} />
    <Location location={ItemLocation.Bank} {character} />
</div>
