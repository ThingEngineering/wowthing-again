<script lang="ts">
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'

    import { data as settingsData } from '@/stores/settings'
    import type { SettingsChoice } from '@/types'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import HomeTable from '@/components/home/HomeTable.svelte'
    import MagicLists from '../SettingsMagicLists.svelte'
    import RadioGroup from '@/components/forms/RadioGroup.svelte'
    
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
        {key: 'itemLevel', name: 'Item level'},
        {key: 'currentLocation', name: 'Location - Current'},
        {key: 'hearthLocation', name: 'Location - Hearth'},
        {key: 'lockouts', name: 'Lockouts'},
        {key: 'mountSpeed', name: 'Mount speed'},
        {key: 'keystone', name: 'Mythic+ keystone'},
        {key: 'mythicPlusScore', name: 'Mythic+ score'},
        {key: 'playedTime', name: 'Played time'},
        {key: 'professions', name: 'Professions - Pri'},
        {key: 'professionsSecondary', name: 'Professions - Sec'},
        {key: 'restedExperience', name: 'Rested XP'},
        {key: 'statusIcons', name: 'Status icons'},
        {key: 'tasks', name: 'Tasks'},
        {key: 'vaultMythicPlus', name: 'Vault - Mythic+'},
        {key: 'vaultPvp', name: 'Vault - PvP'},
        {key: 'vaultRaid', name: 'Vault - Raid'},
    ]

    const commonActive = $settingsData.layout.commonFields.map(
        (f) => filter(commonChoices, (c) => c.key === f)[0]
    )
    const commonInactive = filter(commonChoices, (c) => commonActive.indexOf(c) < 0)

    const homeActive = $settingsData.layout.homeFields.map(
        (f) => filter(homeChoices, (c) => c.key === f)[0]
    )
    const homeInactive = filter(homeChoices, (c) => homeActive.indexOf(c) < 0)

    const onCommonChange = debounce(() => {
        settingsData.update(state => {
            state.layout.commonFields = commonActive.map((c) => c.key)
            return state
        })
    }, 100)

    const onHomeChange = debounce(() => {
        settingsData.update(state => {
            state.layout.homeFields = homeActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<style lang="scss">
    h2 + h3 {
        border-top: 0;
    }
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
    .wrapper {
        display: flex;
        gap: 1rem;
    }
</style>

<div>
    <div class="thing-container settings-container">
        <h2>Layout</h2>

        <h3>Padding</h3>

        <div class="setting setting-layout">
            <RadioGroup
                bind:value={$settingsData.layout.padding}
                name="layout_padding"
                options={[
                    ['small', 'Small'],
                    ['medium', 'Medium'],
                    ['large', 'Large'],
                ]}
            />
            <p>How much white space is used between columns.</p>
        </div>
        
        <h3>Covenant column</h3>

        <div class="setting setting-layout">
            <RadioGroup
                bind:value={$settingsData.layout.covenantColumn}
                name="layout_covenantColumn"
                options={[
                    ['current', 'Current only'],
                    ['all', 'All'],
                ]}
            />
            <p>How many covenants to display in the covenant column.</p>
        </div>
        
        <h3>Misc</h3>

        <div class="setting setting-checkbox setting-layout">
            <CheckboxInput
                bind:value={$settingsData.layout.showPartialLevel}
                name="layout_showPartialLevel"
            >
                Show partial levels in Character Level column.
            </CheckboxInput>
        </div>

        <div class="setting setting-checkbox setting-layout">
            <CheckboxInput
                bind:value={$settingsData.layout.includeArchaeology}
                name="layout_includeArchaeology"
            >
                Include Archaeology in Professions - Sec column.
            </CheckboxInput>
        </div>

        <h3>Character table columns</h3>

        <p>
            Drag items between the two lists on the left to control the layout of the
            "common" information shown on many tables. Drag items between the two lists
            on the right to control the extra columns that Home uses.
        </p>

        <div class="wrapper">
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
    </div>

    <HomeTable characterLimit={2} />
</div>
