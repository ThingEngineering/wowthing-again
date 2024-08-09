<script lang="ts">
    import debounce from 'lodash/debounce'

    import { characterNameTooltipChoices } from '@/data/settings'
    import { settingsStore } from '@/shared/stores/settings'
    import type { SettingsChoice } from '@/shared/stores/settings/types';

    import MagicLists from '@/user-home/components/settings/MagicLists.svelte'

    let dataActive = characterNameTooltipChoices
        .filter((choice) => ($settingsStore.characters.disabledNameTooltip || []).indexOf(choice.key) === -1);

    let dataInactive: SettingsChoice[]
    $: {
        dataInactive = characterNameTooltipChoices
            .filter((choice) => dataActive.indexOf(choice) === -1)
        
        onDataChange();
    }

    const onDataChange = debounce(() => {
        settingsStore.update((state) => {
            state.characters.disabledNameTooltip = dataInactive.map((choice) => choice.key);
            return state;
        })
    }, 250);
</script>

<div class="settings-block">
    <h3>Character Name Tooltips</h3>

    <MagicLists
        key={"character-tooltip-data"}
        onFunc={onDataChange}
        active={dataActive}
        inactive={dataInactive}
    />
</div>
