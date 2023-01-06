<script lang="ts">
    import { userStore } from '@/stores'

    import CharacterCard from './card/Card.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .card-container {
        align-items: flex-start;
        display: grid;
        grid-template-columns: repeat(auto-fill, 8.5rem);
        grid-gap: 1rem;
        justify-content: left;
        width: 100%;
    }
</style>

<div class="wrapper">
    <UnderConstruction />

    <div class="card-container">
        {#each $userStore.characters as character}
            <CharacterCard {character} />
        {/each}
    </div>
</div>
