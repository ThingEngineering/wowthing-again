<script lang="ts">
    import {data} from '../../stores/user-store'

    import TableCharacterName from '../common/TableCharacterName.svelte'
    import TableItemLevel from '../common/TableItemLevel.svelte'
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
                <tr class="faction{character.faction}">
                    <TableCharacterName {character} />
                    <TableItemLevel {character} />
                </tr>
            {/each}
        </tbody>
    </table>
</div>
