<script lang="ts">
    import type {Character} from '../../types'
    import getRealmName from '../../utils/get-realm-name'

    import TableIcon from './TableIcon.svelte'
    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'
    import SpecializationIcon from '../images/SpecializationIcon.svelte'

    export let character: Character
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

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

<TableIcon><RaceIcon {character} size=20 /></TableIcon>
<TableIcon><ClassIcon {character} size=20 /></TableIcon>
<TableIcon><SpecializationIcon {character} size=20 /></TableIcon>
<td class="level">{character.level}</td>
<td class="name">{character.name}</td>
<td class="realm">&ndash; {getRealmName(character.realmId)}</td>
