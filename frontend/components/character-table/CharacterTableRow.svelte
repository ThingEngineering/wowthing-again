<script lang="ts">
    import { setContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

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
    let element: HTMLElement
    let intersected = false
    $: {
        accountEnabled =
            character.accountId === undefined ||
            $userStore.data.accounts[character.accountId].enabled
    }
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

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <tr
        bind:this={element}
        class="faction{character.faction}"
        class:inactive={!accountEnabled}
        class:last-of-group={last}
    >
        {#if intersected}
            {#each $settings.layout.commonFields as field}
                {#if field === 'accountTag' && userStore.useAccountTags}
                    <td class="tag">{$userStore.data.accounts[character.accountId].tag || ''}</td>

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
                    <td class="level">{character.level}</td>

                {:else if field === 'characterName'}
                    <td class="name">{character.name}</td>

                {:else if field === 'realmName'}
                    <td class="realm">&ndash; {getRealmName(character.realmId)}</td>
                {/if}
            {/each}

            <slot name="rowExtra" />
        {:else}
            <td>&nbsp;</td>
        {/if}
    </tr>
</IntersectionObserver>
