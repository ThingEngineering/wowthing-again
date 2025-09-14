<script lang="ts">
    import { setContext } from 'svelte';
    import IntersectionObserver from 'svelte-intersection-observer';

    import { settingsState } from '@/shared/state/settings.svelte';
    import type { CharacterProps } from '@/types/props';

    import CharacterLevel from './row/CharacterLevel.svelte';
    import CharacterName from './row/CharacterName.svelte';
    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import RaceIcon from '@/shared/components/images/RaceIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
    import TableIcon from '@/components/common/TableIcon.svelte';

    let { character, last }: CharacterProps & { last: boolean } = $props();

    setContext('character', character);

    let element: HTMLElement = $state(null);
    let intersected = $state(false);

    let accountEnabled = $derived(
        !character?.accountId || settingsState.value.accounts?.[character?.accountId]?.enabled
    );
    let commonFields = $derived(settingsState.activeView.commonFields);
</script>

<style lang="scss">
    .tag {
        background: var(--color-highlight-background);
        border-right: 1px solid var(--border-color);
    }
    .realm {
        --width: 8rem;

        white-space: nowrap;
    }
    .warband-bank {
        padding-bottom: 1px;
        padding-top: 1px;
    }
</style>

<IntersectionObserver once {element} bind:intersecting={intersected}>
    <tr
        bind:this={element}
        class="faction{character?.faction}"
        class:faded={!accountEnabled}
        class:last-of-group={last}
        data-id={character?.id}
    >
        {#if intersected}
            {#if character}
                {#each commonFields as field (field)}
                    {#if field === 'accountTag' && settingsState.useAccountTags}
                        <td class="tag">
                            {settingsState.value.accounts?.[character.accountId]?.tag}
                        </td>
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
                        <td class="realm text-overflow"
                            >{character.realm?.name || 'Unknown Realm'}</td
                        >
                    {/if}
                {/each}
            {:else}
                <td class="warband-bank" colspan={commonFields.length}> Warbank Bank </td>
            {/if}

            <slot name="rowExtra" />
        {:else}
            <td>&nbsp;</td>
        {/if}
    </tr>
</IntersectionObserver>
