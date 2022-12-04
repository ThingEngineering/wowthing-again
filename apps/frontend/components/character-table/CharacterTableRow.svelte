<script lang="ts">
    import { setContext } from 'svelte'
    import IntersectionObserver from 'svelte-intersection-observer'

    import { Constants } from '@/data/constants'
    import { experiencePerLevel } from '@/data/experience'
    import { Region } from '@/enums'
    import { userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'
    import leftPad from '@/utils/left-pad'
    import type { Character } from '@/types'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import RaceIcon from '@/components/images/RaceIcon.svelte'
    import SpecializationIcon from '@/components/images/SpecializationIcon.svelte'
    import TableIcon from '@/components/common/TableIcon.svelte'

    export let character: Character
    export let last: boolean

    setContext('character', character)

    let accountEnabled: boolean
    let element: HTMLElement
    let fancyLevel: string
    let intersected = false
    $: {
        accountEnabled =
            !character.accountId ||
            $userStore.data.accounts[character.accountId]?.enabled

        const actualLevel = Math.max(character.level, character.addonLevel)
        if (actualLevel < Constants.characterMaxLevel) {
            const partial = Math.floor(character.addonLevelXp / experiencePerLevel[actualLevel] * 10)
            fancyLevel = `${leftPad(actualLevel, 2, '&nbsp;')}.${partial}`
        }
        else {
            fancyLevel = `${leftPad(actualLevel, 2, '&nbsp;')}&nbsp;&nbsp;`
        }
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
    .level-partial {
        @include cell-width($width-level-partial);

        text-align: right;
    }
    .name {
        @include cell-width($width-name, $maxWidth: $width-name-max);

        white-space: nowrap;
    }
    .realm {
        @include cell-width($width-realm, $maxWidth: $width-realm-max);

        white-space: nowrap;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <tr
        bind:this={element}
        class="faction{character.faction}"
        class:inactive={!accountEnabled}
        class:last-of-group={last}
        data-id="{character.id}"
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
                    {#if $settings.layout.showPartialLevel}
                        <td class="level-partial">
                            <code>{@html fancyLevel}</code>
                        </td>
                    {:else}
                        <td class="level">
                            {Math.max(character.level, character.addonLevel)}
                        </td>
                    {/if}

                {:else if field === 'characterName'}
                    <td class="name">
                        <a href="#/characters/{Region[character.realm.region].toLowerCase()}-{character.realm.slug}/{character.name}">
                            {character.name}
                        </a>
                    </td>

                {:else if field === 'realmName'}
                    <td class="realm">{character.realm.name}</td>
                {/if}
            {/each}

            <slot name="rowExtra" />
        {:else}
            <td>&nbsp;</td>
        {/if}
    </tr>
</IntersectionObserver>
