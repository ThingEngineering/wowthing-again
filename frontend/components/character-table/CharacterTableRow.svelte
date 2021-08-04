<script lang="ts">
    import { getContext, setContext } from 'svelte'

    import { data as settings } from '@/stores/settings'
    import { userStore } from '@/stores'
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
    let iconComponents: any[]
    $: {
        accountEnabled =
            character.accountId === undefined ||
            $userStore.data.accounts[character.accountId].enabled
        endSpacer = getContext('endSpacer')

        iconComponents = []
        if ($settings.general.showRaceIcon) {
            iconComponents.push(RaceIcon)
        }
        if ($settings.general.showClassIcon) {
            iconComponents.push(ClassIcon)
        }
        if ($settings.general.showSpecIcon) {
            iconComponents.push(SpecializationIcon)
        }
    }
</script>

<style lang="scss">
    .inactive {
        opacity: $inactive-opacity;
    }
    .level {
        @include cell-width($width-level);

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
    {#each iconComponents as iconComponent, iconIndex}
        <TableIcon padLeft={iconIndex === 0 ? '0.25rem' : '0px'} padRight={iconIndex === (iconComponents.length - 1) ? '0.25rem' : '0px'}>
            <svelte:component this={iconComponent} {character} />
        </TableIcon>
    {/each}

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
