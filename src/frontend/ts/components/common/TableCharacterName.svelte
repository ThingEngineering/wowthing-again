<script lang="ts">
    import type {Character} from '../../types'
    import getRealmName from '../../utils/get-realm-name'

    import ClassIcon from '../images/ClassIcon.svelte'
    import RaceIcon from '../images/RaceIcon.svelte'

    export let character: Character
</script>

<style lang="scss">
    .level {
        padding-left: 0.5rem;
        text-align: right;
    }
    .name {
        padding-left: 0.5rem;
    }
</style>

<td><RaceIcon character={character} size=20 /></td>
<td><ClassIcon character={character} size=20 /></td>
<td class="level">{character.level}</td>
<td class="name">{character.name}</td>
<td class="realm">&ndash; {getRealmName(character.realmId)}</td>
