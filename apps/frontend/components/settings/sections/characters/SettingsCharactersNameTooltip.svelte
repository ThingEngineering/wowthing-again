<script lang="ts">
    import debounce from 'lodash/debounce'

    import { characterNameTooltipChoices } from '@/data/settings'
    import { settingsStore } from '@/shared/stores/settings'

    import MagicLists from '@/components/settings/SettingsMagicLists.svelte'

    const dataActive = $settingsStore.characters.nameTooltipDisplay
        .map((f) => characterNameTooltipChoices.filter((c) => c.key === f)[0])
        .filter(f => f !== undefined)
    const dataInactive = characterNameTooltipChoices.filter((c) => dataActive.indexOf(c) === -1)

    const onTaskChange = debounce(() => {
        settingsStore.update(state => {
            state.characters.nameTooltipDisplay = dataActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<div class="settings-block">
    <h3>Character Name Tooltips</h3>

    <MagicLists
        key={"character-tooltip-data"}
        onFunc={onTaskChange}
        active={dataActive}
        inactive={dataInactive}
    />
</div>
