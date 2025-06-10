<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { userState } from '@/user-home/state/user';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import type { SettingsChoice } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';

    const sortFunc = $getCharacterSortFunc();

    let characterChoices: SettingsChoice[] = $derived.by(() =>
        sortBy(userState.general.characters, (char) => sortFunc(char)).map((char) => ({
            id: char.id.toString(),
            name: `${char.name}-${char.realm.name}`,
        }))
    );
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Pin Characters</h2>

    <p>
        Search for characters and "pin" them to the top of the characters table. Drag and drop to
        change the order of the pinned characters.
    </p>

    <MagicLists
        key="pin"
        choices={characterChoices}
        bind:activeNumberIds={settingsState.value.characters.pinnedCharacters}
    />
</div>
