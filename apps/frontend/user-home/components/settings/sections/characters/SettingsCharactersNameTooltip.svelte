<script lang="ts">
    import debounce from 'lodash/debounce';

    import { characterNameTooltipChoices } from '@/data/settings';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SettingsChoice } from '@/shared/stores/settings/types';

    import MagicLists from '@/user-home/components/settings/MagicLists.svelte';

    let dataActive = characterNameTooltipChoices.filter(
        (choice) =>
            (settingsState.value.characters.disabledNameTooltip || []).indexOf(choice.id) === -1,
    );

    let dataInactive: SettingsChoice[] = $state(
        characterNameTooltipChoices.filter((choice) => dataActive.indexOf(choice) === -1),
    );

    $effect(() =>
        debounce(() => {
            settingsState.value.characters.disabledNameTooltip = dataInactive.map(
                (choice) => choice.id,
            );
        }, 250),
    );
</script>

<div class="settings-block">
    <h3>Character Name Tooltips</h3>

    <MagicLists
        key="character-tooltip-data"
        choices={characterNameTooltipChoices}
        bind:activeStringIds={settingsState.value.characters.disabledNameTooltip}
        saveInactive={true}
    />
</div>
