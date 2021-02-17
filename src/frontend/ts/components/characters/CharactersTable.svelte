<script lang="ts">
    import {data} from '../../stores/user-store'

    import CharacterTableRow from './table/CharacterTableRow.svelte'
</script>

<style lang="scss">
    div {
        padding: 0 0.5rem;
    }
</style>

<div class="thing-container">
    <table class="table-striped">
        <tbody>
            {#each $data.characters as character}
                <CharacterTableRow {character} />
            {/each}
        </tbody>
    </table>
</div>
