<script lang="ts">
    import type {TeamDataCharacter} from '@/types'
    import getRealmName from '@/utils/get-realm-name'

    export let teamCharacter: TeamDataCharacter
</script>

<style lang="scss">
</style>

<td>{teamCharacter.character.name}</td>
<td>&ndash; {getRealmName(teamCharacter.character.realmId)}</td>
