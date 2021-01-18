<script lang="ts">
    import type {Character} from '../../types'
    import getRealmName from '../../utils/get-realm-name'

    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'

    export let character: Character
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    .icon {
        text-align: center;
        width: $character-width-icon;

        & :global(img) {
            margin-top: -4px;
        }
    }
    .level {
        padding-left: 0.5rem;
        text-align: right;
        width: $character-width-level;
    }
    .name {
        padding-left: 0.5rem;
        width: $character-width-name;
    }
    .realm {
        width: $character-width-realm;
    }
</style>

<td class="icon"><RaceIcon character={character} size=20 /></td>
<td class="icon"><ClassIcon character={character} size=20 /></td>
<td class="level">{character.level}</td>
<td class="name">{character.name}</td>
<td class="realm">&ndash; {getRealmName(character.realmId)}</td>
