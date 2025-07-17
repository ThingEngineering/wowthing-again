<script lang="ts">
    import groupBy from 'lodash/groupBy';
    import sortBy from 'lodash/sortBy';
    import { location } from 'svelte-spa-router';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { timeStore } from '@/shared/stores/time';
    import { lazyStore, userQuestStore } from '@/stores';
    import { homeState, newNavState } from '@/stores/local-storage';
    import { userState } from '@/user-home/state/user';
    import { useCharacterFilter } from '@/utils/characters';
    import { getCharacterGroupContext } from '@/utils/get-character-group-func';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import { homeSort } from '@/utils/home';
    import type { Character } from '@/types';

    import CharacterRow from './CharacterTableRow.svelte';

    type Props = {
        characterLimit: number;
        isHome: boolean;
        showEmpty: boolean;
        showWarbank: boolean;
        skipGrouping: boolean;
        skipIgnored: boolean;
        filterFunc: (char: Character) => boolean;
        sortFunc: (char: Character) => string;
    };

    let {
        characterLimit = 0,
        isHome = false,
        showEmpty = true,
        showWarbank = false,
        skipGrouping = false,
        skipIgnored = false,
        filterFunc = () => true,
        sortFunc,
    }: Partial<Props> = $props();

    sortFunc ||= $getCharacterSortFunc(undefined, settingsState.activeView.sortBy);

    let groupByContext = $derived.by(() =>
        getCharacterGroupContext(
            settingsState.value,
            settingsState.activeView.groupBy,
            settingsState.activeView.sortBy
        )
    );

    let [characters, groups] = $derived.by(() => {
        let characters = userState.general.characters.filter(
            (c) =>
                settingsState.value.characters.hiddenCharacters.indexOf(c.id) === -1 &&
                (skipIgnored ||
                    settingsState.value.characters.ignoredCharacters.indexOf(c.id) === -1) &&
                (settingsState.value.characters.hideDisabledAccounts === false ||
                    settingsState.value.accounts?.[c.accountId]?.enabled !== false)
        );

        characters = characters.filter((char) =>
            useCharacterFilter(
                $lazyStore,
                settingsState.value,
                $userQuestStore,
                filterFunc,
                char,
                $newNavState.characterFilter ||
                    ($location === '/' ? settingsState.activeView.characterFilter : '')
            )
        );

        if (characterLimit > 0) {
            characters = characters.slice(0, characterLimit);
        }

        let grouped: Record<string, Character[]>;
        if (skipGrouping) {
            grouped = {
                all: characters,
            };
        } else {
            grouped = groupBy(characters, groupByContext.groupByFn);
        }

        const groupKeys = Object.keys(grouped);
        groupKeys.sort();

        const pairs: [string, Character[]][] = [];
        for (let keyIndex = 0; keyIndex < groupKeys.length; keyIndex++) {
            const key = groupKeys[keyIndex];
            const sortKey = `${settingsState.activeView.id}|${keyIndex}`;
            const keySort =
                isHome && $homeState.groupSort[sortKey]
                    ? $getCharacterSortFunc((char) =>
                          homeSort(
                              settingsState.activeView,
                              $lazyStore,
                              $timeStore,
                              $homeState.groupSort[sortKey],
                              char
                          )
                      )
                    : sortFunc;
            pairs.push([key, sortBy(grouped[key], keySort)]);
        }

        pairs.sort();
        let groups = pairs.map(([, group]) => group);
        if (groups.length === 1 && groups[0].length === 0) {
            groups = [];
        }

        return [characters, groups];
    });

    const paddingMap: Record<string, number> = {
        small: 1,
        medium: 2,
        large: 3,
    };
</script>

<style lang="scss">
    .uhoh {
        @include cell-width(50rem);

        background: $horde-background;
        padding-top: 0.5rem;
        white-space: normal;
    }
</style>

{#if characters.length > 0 || showEmpty}
    <div>
        <slot name="preTable" />

        <table
            class="table table-striped character-table"
            style="--padding: {paddingMap[settingsState.value.layout.padding] || 1};"
        >
            <slot name="head" />
            <tbody>
                {#if showWarbank}
                    <CharacterRow character={null} last={false}>
                        <slot slot="rowExtra" name="warbankExtra" />
                    </CharacterRow>
                {/if}

                {#each groups as group, groupIndex}
                    <slot name="groupHead" {group} {groupIndex} {groupByContext} />

                    {#each group as character, characterIndex (character.id)}
                        <CharacterRow {character} last={characterIndex === group.length - 1}>
                            <slot slot="rowExtra" name="rowExtra" {character} />
                        </CharacterRow>
                    {/each}
                {:else}
                    {#if !showWarbank}
                        <slot name="emptyRow">
                            <tr>
                                <td class="uhoh">
                                    {#if userState.general.characters.length > 0}
                                        It looks like you have characters but none match your
                                        current character filter, try clearing that (end of the
                                        navigation)!
                                    {:else}
                                        It looks like you have no valid characters. If this is a new
                                        account, check again in a minute or so. If you still have no
                                        characters, try:

                                        <ul>
                                            <li>
                                                Log out and back in on this site to trigger an
                                                account update.
                                            </li>
                                            <li>
                                                If that didn't work, reset WoWthing's permissions on
                                                Battle.net: go to your <a
                                                    href="https://account.battle.net/connections#connected-accounts"
                                                    >Battle.net Connections page</a
                                                >, find "WoWthing Live" and click
                                                <code>X REMOVE</code>. Then log out and back in on
                                                this site. DO NOT UNTICK THE BOX WHEN BATTLE.NET
                                                ASKS!
                                            </li>
                                            <li>
                                                If that still didn't work, drop by <a
                                                    href="https://discord.gg/4UkTT5y">the Discord</a
                                                > and ask for help.
                                            </li>
                                        </ul>
                                    {/if}
                                </td>
                            </tr>
                        </slot>
                    {/if}
                {/each}
            </tbody>
            <slot name="foot" />
        </table>
    </div>
{/if}
