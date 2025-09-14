<script lang="ts">
    import debounce from 'lodash/debounce';
    import find from 'lodash/find';
    import groupBy from 'lodash/groupBy';
    import sortBy from 'lodash/sortBy';

    import { Region } from '@/enums/region';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import type { Character } from '@/types';

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';

    const allCharacterIds: string[] = userState.general.activeCharacters.map((char) =>
        char.id.toString()
    );

    let hiddenCharacters: string[] = $state(
        userState.general.activeCharacters
            .filter((char) => settingsState.value.characters.hiddenCharacters.includes(char.id))
            .map((char) => char.id.toString())
    );

    let ignoredCharacters: string[] = $state(
        userState.general.activeCharacters
            .filter((char) => settingsState.value.characters.ignoredCharacters.includes(char.id))
            .map((char) => char.id.toString())
    );

    let realms = $derived.by(() => {
        let ret: [string, Character[]][];

        const sortFunc = getCharacterSortFunc();
        const grouped: Record<string, Character[]> = groupBy(
            userState.general.activeCharacters,
            (c) => `${Region[c.realm.region]}|${c.realm.name}`
        );
        for (const realmName in grouped) {
            grouped[realmName] = sortBy(grouped[realmName], sortFunc);
        }

        ret = Object.entries(grouped);
        ret.sort();
        return ret;
    });

    $effect(() => debouncedUpdateSettings(hiddenCharacters, ignoredCharacters));

    const debouncedUpdateSettings = debounce((hiddenChars: string[], ignoredChars: string[]) => {
        settingsState.value.characters.hiddenCharacters = allCharacterIds
            .filter((charId) => hiddenChars.indexOf(charId) >= 0)
            .map((charId) => parseInt(charId));

        settingsState.value.characters.ignoredCharacters = allCharacterIds
            .filter((charId) => ignoredChars.indexOf(charId) >= 0)
            .map((charId) => parseInt(charId));
    }, 100);

    const realmClick = function (this: HTMLElement): void {
        const type = this.innerText === '[hide all]' ? 'hide' : 'ignore';

        const tr = this.parentElement.parentElement;
        const realmString = `${tr.children[0].innerHTML.trim().substring(1, 3)}|${tr.children[1].innerHTML.trim()}`;

        const realmCharacters: string[] = find(realms, ([realm]) => realm === realmString)[1].map(
            (char) => char.id.toString()
        );

        const anyMissing: boolean = realmCharacters.some(
            (charId) =>
                (type === 'hide' ? hiddenCharacters : ignoredCharacters).indexOf(charId) === -1
        );
        const toChange: string[] = realmCharacters.filter(
            (charId) =>
                !anyMissing ||
                (anyMissing &&
                    (type === 'hide' ? hiddenCharacters : ignoredCharacters).indexOf(charId) === -1)
        );

        for (const charId of toChange) {
            setTimeout(() => document.getElementById(`input-${type}_character_${charId}`).click());
        }
    };
</script>

<style lang="scss">
    .settings-block {
        width: 28rem;
    }
    ul {
        margin-bottom: 0;
    }
    table {
        margin-top: 1rem;
    }
    td,
    th {
        white-space: nowrap;
    }
    th {
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
    }
    .realm {
        --width: var(--width-name-max);

        text-align: left;
    }
    .level {
        --width: 2rem;

        text-align: right;
    }
    .name {
        --width: var(--width-name-max);

        text-align: left;
    }
    .ignore,
    .hide {
        --width: 6rem;

        cursor: pointer;
        text-align: center;

        :global(fieldset[data-state='false']) {
            background: inherit;
        }
        :global(fieldset[data-state='true']) {
            background: rgba(255, 0, 0, 0.2);
        }
        :global(fieldset.disabled) {
            color: #888;
        }
    }
</style>

<div class="settings-block">
    <ul>
        <li>
            "Ignore" will stop including this character in most things, basically marking as
            inactive.
        </li>
        <li>"Hide" will completely hide this character.</li>
    </ul>
</div>

{#each realms as [realm, characters]}
    {@const realmParts = realm.split('|')}
    <div class="settings-block">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="level">[{realmParts[0]}]</th>
                    <th class="name">{realmParts[1]}</th>
                    <th class="ignore">
                        <button onclick={realmClick}>[ignore all]</button>
                    </th>
                    <th class="hide">
                        <button onclick={realmClick}>[hide all]</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each characters as character}
                    {@const idString = character.id.toString()}
                    <tr>
                        <td class="level">
                            <code>{character.level}</code>
                        </td>
                        <td class="name class-{character.classId}">{character.name}</td>
                        <td class="ignore">
                            <GroupedCheckbox
                                name="ignore_character_{character.id}"
                                bind:bindGroup={ignoredCharacters}
                                disabled={hiddenCharacters.includes(idString)}
                                value={idString}>Ignore</GroupedCheckbox
                            >
                        </td>
                        <td class="hide">
                            <GroupedCheckbox
                                name="hide_character_{character.id}"
                                bind:bindGroup={hiddenCharacters}
                                value={idString}>Hide</GroupedCheckbox
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/each}
