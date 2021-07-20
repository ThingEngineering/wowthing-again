<script lang="ts">
    import { getContext, setContext } from 'svelte'

    import { data as settings } from '@/stores/settings'
    import userStore from '@/stores/user'
    import type { Character } from '@/types'
    import getRealmName from '@/utils/get-realm-name'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import RaceIcon from '@/components/images/RaceIcon.svelte'
    import SpecializationIcon from '@/components/images/SpecializationIcon.svelte'

    export let character: Character
    export let last: boolean

    setContext('character', character)

    let accountEnabled: boolean
    let endSpacer: boolean
    $: {
        accountEnabled =
            character.accountId === undefined ||
            $userStore.data.accounts[character.accountId].enabled
        endSpacer = getContext('endSpacer')
    }
</script>

<style lang="scss">
    .inactive {
        opacity: $inactive-opacity;
    }
    .level {
        @include cell-width($width-level, 0.4rem);

        text-align: right;
    }
    .name {
        @include cell-width($width-name);
    }
    .realm {
        @include cell-width($width-realm);
    }
</style>

<tr class="faction{character.faction}" class:inactive={!accountEnabled} class:last-of-group={last}>
    {#if $settings.general.showRaceIcon}
        <TableIcon>
            <RaceIcon {character} />
        </TableIcon>
    {/if}

    {#if $settings.general.showClassIcon}
        <TableIcon padLeft="0px">
            <ClassIcon {character} />
        </TableIcon>
    {/if}

    {#if $settings.general.showSpecIcon}
        <TableIcon padLeft="0px">
            <SpecializationIcon {character} />
        </TableIcon>
    {/if}

    <td class="level">{character.level}</td>
    <td class="name">{character.name}</td>

    {#if $settings.general.showRealm}
        <td class="realm">&ndash; {getRealmName(character.realmId)}</td>
    {/if}

    <slot name="rowExtra" />

    {#if endSpacer === true}
        <td class="spacer">&nbsp;</td>
    {/if}
</tr>
