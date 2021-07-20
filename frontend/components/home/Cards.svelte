<script lang="ts">
    import userStore from '@/stores/user'

    import CharacterCard from './card/Card.svelte'
</script>

<style lang="scss">
    section {
        align-items: flex-start;
        display: grid;
        grid-template-columns: repeat(auto-fill, 8.5rem);
        grid-gap: 1rem;
        justify-content: left;
        width: 100%;
    }
</style>

<section>
    {#each $userStore.data.characters as character}
        <CharacterCard {character} />
    {/each}
</section>
