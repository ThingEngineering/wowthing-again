<script lang="ts">
    import {data} from '../../stores/user-store'

    import CharacterCard from './card/Card.svelte'
</script>

<style lang="scss">
    @import "../../../scss/variables.scss";

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
    {#each $data.characters as character}
        <CharacterCard character={character} />
    {/each}
</section>
