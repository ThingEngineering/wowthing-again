<script lang="ts">
    import { uiIcons } from '@/shared/icons';
    import { settingsState } from '@/shared/state/settings.svelte';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import NameTooltip from './characters/SettingsCharactersNameTooltip.svelte';
    import RadioGroup from '@/shared/components/forms/RadioGroup.svelte';
</script>

<style lang="scss">
    h3 {
        border-top: 1px dashed var(--border-color);
        margin-top: 0.5rem;
        padding-top: 0.5rem;
    }
    .setting-layout {
        :global(fieldset) {
            display: flex;
        }
    }
    .settings-block {
        :global(.columns h3) {
            border-top: none;
            padding-top: 0;
        }
    }
</style>

<div class="settings-block">
    <h3>Navigation</h3>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={settingsState.value.layout.newNavigation}
            name="layout_newNavigation"
        >
            Use new navigation
        </CheckboxInput>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={settingsState.value.layout.newNavigationIcons}
            name="layout_newNavigationIcons"
            disabled={!settingsState.value.layout.newNavigation}
        >
            Only show icons
        </CheckboxInput>
    </div>

    <h4>Show in main nav</h4>

    <div class="setting-checkboxes" style:--fieldset-width="10rem">
        <CheckboxInput
            bind:value={settingsState.value.layout.navigationAppearances}
            name="layout_navigationAppearances"
        >
            Appearances
        </CheckboxInput>
        <CheckboxInput
            bind:value={settingsState.value.layout.navigationCustomizations}
            name="layout_navigationCustomizations"
        >
            Customizations
        </CheckboxInput>
        <CheckboxInput
            bind:value={settingsState.value.layout.navigationMounts}
            name="layout_navigationMounts"
        >
            Mounts
        </CheckboxInput>
        <CheckboxInput
            bind:value={settingsState.value.layout.navigationPets}
            name="layout_navigationPets"
        >
            Pets
        </CheckboxInput>
        <CheckboxInput
            bind:value={settingsState.value.layout.navigationToys}
            name="layout_navigationToys"
        >
            Toys
        </CheckboxInput>
    </div>
</div>

<div class="settings-block">
    <h3>Padding</h3>

    <div class="setting setting-layout">
        <RadioGroup
            bind:value={settingsState.value.layout.padding}
            name="layout_padding"
            options={[
                ['small', 'Small'],
                ['medium', 'Medium'],
                ['large', 'Large'],
            ]}
        />
        <p>How much white space is used between columns.</p>
    </div>
</div>

<div class="settings-block">
    <h3>Lockouts</h3>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={settingsState.value.layout.showEmptyLockouts}
            name="layout_showEmptyLockouts"
        >
            Show a <span class="status-fail"><IconifyIcon icon={uiIcons.starHalf} /></span>
            for empty lockouts.
        </CheckboxInput>
    </div>
</div>

<div class="settings-block">
    <h3>Covenant column</h3>

    <div class="setting setting-layout">
        <RadioGroup
            bind:value={settingsState.value.layout.covenantColumn}
            name="layout_covenantColumn"
            options={[
                ['current', 'Current only'],
                ['all', 'All'],
            ]}
        />
        <p>How many covenants to display in the covenant column.</p>
    </div>
</div>

<div class="settings-block">
    <h3>Misc</h3>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={settingsState.value.layout.useClassColors}
            name="layout_useClassColors"
        >
            Use class colors instead of faction colors for character names.
        </CheckboxInput>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={settingsState.value.layout.showPartialLevel}
            name="layout_showPartialLevel"
        >
            Show partial levels in Character Level column.
        </CheckboxInput>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={settingsState.value.layout.includeArchaeology}
            name="layout_includeArchaeology"
        >
            Include Archaeology in Professions - Sec column.
        </CheckboxInput>
    </div>
</div>

<NameTooltip />
