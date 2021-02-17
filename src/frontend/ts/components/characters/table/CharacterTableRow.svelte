<script lang="ts">
    import {data as userData} from '../../../stores/user-store'
    import type {Character} from '../../../types'

    import CharacterTableCovenant from './CharacterTableCovenant.svelte'
    import TableCharacterName from '../../common/TableCharacterName.svelte'
    import TableItemLevel from '../../common/TableItemLevel.svelte'

    export let character: Character

    $: accountEnabled = (character.accountId === undefined || $userData.accounts[character.accountId].enabled)
</script>

<style lang="scss">
    @import "../../../../scss/variables.scss";

    .inactive {
        opacity: $inactive-opacity;
    }
</style>

<tr class="faction{character.faction}" class:inactive={!accountEnabled}>
    <TableCharacterName {character} />
    <TableItemLevel {character} />
    <CharacterTableCovenant {character} />
</tr>
