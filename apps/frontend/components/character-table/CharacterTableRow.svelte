<script lang="ts">
    import { setContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { userStore } from '@/stores'
    import { activeView } from '@/shared/stores/settings'
    import type { Character } from '@/types'

    import CharacterLevel from './row/CharacterLevel.svelte'
    import CharacterName from './row/CharacterName.svelte'
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte'
    import RaceIcon from '@/shared/components/images/RaceIcon.svelte'
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte'
    import TableIcon from '@/components/common/TableIcon.svelte'

    export let character: Character
    export let last: boolean

    setContext('character', character)

    let element: HTMLElement
    let intersected = false

    $: accountEnabled = !character?.accountId || $userStore.accounts[character?.accountId]?.enabled
    $: commonFields = $activeView.commonFields
</script>

<style lang="scss">
    .inactive {
        opacity: $inactive-opacity;
    }
    .tag {
        background: $highlight-background;
        border-right: 1px solid $border-color;
        padding-left: $width-padding;
        padding-right: $width-padding;
    }
    .realm {
        @include cell-width($width-realm);

        white-space: nowrap;
    }
    .warband-bank {
        padding: 1px $width-padding;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <tr
        bind:this={element}
        class="faction{character?.faction}"
        class:inactive={!accountEnabled}
        class:last-of-group={last}
        data-id="{character?.id}"
    >
        {#if intersected}
            {#if character}
                {#each commonFields as field}
                    {#if field === 'accountTag' && userStore.useAccountTags}
                        <td class="tag">{$userStore.accounts[character.accountId].tag || ''}</td>

                    {:else if field === 'characterIconClass'}
                        <TableIcon padLeft="0.1rem" padRight="0px">
                            <ClassIcon {character} />
                        </TableIcon>

                    {:else if field === 'characterIconRace'}
                        <TableIcon padLeft="0.1rem" padRight="0px">
                            <RaceIcon {character} />
                        </TableIcon>

                    {:else if field === 'characterIconSpec'}
                        <TableIcon padLeft="0.1rem" padRight="0px">
                            <SpecializationIcon {character} />
                        </TableIcon>

                    {:else if field === 'characterLevel'}
                        <CharacterLevel {character} />

                    {:else if field === 'characterName'}
                        <CharacterName {character} />

                    {:else if field === 'realmName'}
                        <td class="realm text-overflow">{character.realm.name}</td>
                    {/if}
                {/each}
            {:else}
                <td class="warband-bank" colspan="{commonFields.length}">
                    Warbank Bank
                </td>
            {/if}

            <slot name="rowExtra" />
        {:else}
            <td>&nbsp;</td>
        {/if}
    </tr>
</IntersectionObserver>
