<script lang="ts">
    import { data } from '../stores/user-store'
</script>

<style lang="scss">
    @import "../../scss/variables.scss";
    div {
        background: $thing-background;
        border: 1px solid $border-color;
        padding: 0.5rem 0.75rem;
    }
    table {
    }
</style>

<div>
    <table>
        {#each $data.characters as character}
            <tr class="{character.faction === 0 ? 'faction0' : 'faction1'}">
                <td>{@html character.getRaceIcon(20)}</td>
                <td>{@html character.getClassIcon(20)}</td>
                <td>{character.name}</td>
                <td>&mdash; {character.getRealmName()}</td>
                <td>{character.level}</td>
            </tr>
        {/each}
    </table>
</div>
