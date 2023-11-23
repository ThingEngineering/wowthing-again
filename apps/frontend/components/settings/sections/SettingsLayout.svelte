<script lang="ts">
    import debounce from 'lodash/debounce'

    import { settingsStore } from '@/shared/stores/settings'
    import type { SettingsChoice } from '@/shared/stores/settings/types'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import MagicLists from '../SettingsMagicLists.svelte'
    import NameTooltip from './characters/SettingsCharactersNameTooltip.svelte'
    import RadioGroup from '@/shared/components/forms/RadioGroup.svelte'
    
    const commonChoices: SettingsChoice[] = [
        {key: 'accountTag', name: 'Account tag'},
        {key: 'characterLevel', name: 'Character level'},
        {key: 'characterName', name: 'Character name'},
        {key: 'characterIconClass', name: 'Icon - Class'},
        {key: 'characterIconRace', name: 'Icon - Race'},
        {key: 'characterIconSpec', name: 'Icon - Specialization'},
        {key: 'realmName', name: 'Realm name'},
    ]
    const homeChoices: SettingsChoice[] = [
        {key: 'callings', name: 'Callings'},
        {key: 'covenant', name: 'Covenant'},
        {key: 'emissariesBfa', name: 'Emissaries - BfA'},
        {key: 'emissariesLegion', name: 'Emissaries - Legion'},
        {key: 'gear', name: 'Gear'},
        {key: 'gold', name: 'Gold'},
        {key: 'guild', name: 'Guild'},
        {key: 'itemLevel', name: 'Item level'},
        {key: 'currentLocation', name: 'Location - Current'},
        {key: 'hearthLocation', name: 'Location - Hearth'},
        {key: 'lockouts', name: 'Lockouts'},
        {key: 'keystone', name: 'Mythic+ keystone'},
        {key: 'mythicPlusScore', name: 'Mythic+ score'},
        {key: 'playedTime', name: 'Played time'},
        {key: 'professions', name: 'Professions - Primary'},
        {key: 'professionsSecondary', name: 'Professions - Secondary'},
        {key: 'professionCooldowns', name: 'Profession Cooldowns'},
        {key: 'professionWorkOrders', name: 'Profession Work Orders'},
        {key: 'restedExperience', name: 'Rested XP'},
        {key: 'statusIcons', name: 'Status icons'},
        {key: 'tasks', name: 'Tasks'},
        {key: 'vaultMythicPlus', name: 'Vault - Dungeon'},
        {key: 'vaultPvp', name: 'Vault - PvP'},
        {key: 'vaultRaid', name: 'Vault - Raid'},
    ]

    const commonActive = $settingsStore.layout.commonFields.map(
        (f) => commonChoices.filter((c) => c.key === f)[0]
    ).filter((f) => f !== undefined)
    const commonInactive = commonChoices.filter((c) => commonActive.indexOf(c) < 0)

    const homeActive = $settingsStore.layout.homeFields.map(
        (f) => homeChoices.filter((c) => c.key === f)[0]
    ).filter((f) => f !== undefined)
    const homeInactive = homeChoices.filter((c) => homeActive.indexOf(c) < 0)

    const onCommonChange = debounce(() => {
        settingsStore.update(state => {
            state.layout.commonFields = commonActive.map((c) => c.key)
            return state
        })
    }, 100)

    const onHomeChange = debounce(() => {
        settingsStore.update(state => {
            state.layout.homeFields = homeActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<style lang="scss">
    h3 {
        border-top: 1px dashed $border-color;
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
            bind:value={$settingsStore.layout.newNavigation}
            name="layout_newNavigation"
        >
            Use new navigation
        </CheckboxInput>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={$settingsStore.layout.newNavigationIcons}
            name="layout_newNavigationIcons"
        >
            Only show icons
        </CheckboxInput>
    </div>
</div>

<div class="settings-block">
    <h3>Padding</h3>

    <div class="setting setting-layout">
        <RadioGroup
            bind:value={$settingsStore.layout.padding}
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
    <h3>Covenant column</h3>

    <div class="setting setting-layout">
        <RadioGroup
            bind:value={$settingsStore.layout.covenantColumn}
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
            bind:value={$settingsStore.layout.useClassColors}
            name="layout_useClassColors"
        >
            Use class colors instead of faction colors for character names.
        </CheckboxInput>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={$settingsStore.layout.showPartialLevel}
            name="layout_showPartialLevel"
        >
            Show partial levels in Character Level column.
        </CheckboxInput>
    </div>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={$settingsStore.layout.includeArchaeology}
            name="layout_includeArchaeology"
        >
            Include Archaeology in Professions - Sec column.
        </CheckboxInput>
    </div>
</div>

<NameTooltip />

<div class="settings-block">
    <h3>Character table columns</h3>
    
    <MagicLists
        key="common"
        title="Common columns"
        onFunc={onCommonChange}
        active={commonActive}
        inactive={commonInactive}
    />

    <MagicLists
        key="home"
        title="Home columns"
        onFunc={onHomeChange}
        active={homeActive}
        inactive={homeInactive}
    />
</div>
