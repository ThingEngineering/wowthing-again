<script lang="ts">
    import { characterNameTooltipChoices } from '@/data/settings';
    import { settingsState } from '@/shared/state/settings.svelte';

    import MagicLists from '@/user-home/components/settings/MagicLists.svelte';
</script>

<div class="settings-block">
    <h3>Character Name Tooltips</h3>

    <MagicLists
        key="character-tooltip-data"
        choices={characterNameTooltipChoices}
        saveInactive={true}
        bind:activeStringIds={settingsState.value.characters.disabledNameTooltip}
    />
</div>
