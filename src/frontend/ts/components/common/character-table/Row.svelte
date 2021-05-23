<script lang="ts">
    import {getContext, setContext} from 'svelte'

    import {data as settings} from '../../../stores/settings-store'
    import {data as userData} from '../../../stores/user-store'
    import type {Character} from '../../../types'
    import getRealmName from '../../../utils/get-realm-name'

    import TableIcon from '../TableIcon.svelte'
    import ClassIcon from '../../images/ClassIcon.svelte'
    import RaceIcon from '../../images/RaceIcon.svelte'
    import SpecializationIcon from '../../images/SpecializationIcon.svelte'

    export let character: Character

    setContext('character', character)

    $: accountEnabled = (character.accountId === undefined || $userData.accounts[character.accountId].enabled)
    $: endSpacer = getContext('endSpacer')
</script>

<style lang="scss">
    @import '../../../../scss/variables';

    .inactive {
        opacity: $inactive-opacity;
    }
    .spacer {
        width: $character-width-spacer;
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

<tr class="faction{character.faction}" class:inactive={!accountEnabled}>
    <td class="spacer"></td>
    <TableIcon>
        <RaceIcon {character} size=20 />
    </TableIcon>
    <TableIcon>
        <ClassIcon {character} size=20 />
    </TableIcon>
    <TableIcon>
        <SpecializationIcon {character} size=20 />
    </TableIcon>
    <td class="level">{character.level}</td>
    <td class="name">{character.name}</td>
    {#if $settings.General.ShowRealm}
        <td class="realm">&ndash; {getRealmName(character.realmId)}</td>
    {/if}
    <slot name="rowExtra" />
    {#if endSpacer === true}
        <td class="spacer"></td>
    {/if}
</tr>
