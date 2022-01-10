<script lang="ts">
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'

    import { data as settingsData } from '@/stores/settings'
    import type { SettingsChoice } from '@/types'

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
        {key: 'gold', name: 'Gold'},
        {key: 'itemLevel', name: 'Item level'},
        {key: 'keystone', name: 'Mythic+ keystone'},
        {key: 'lockouts', name: 'Lockouts'},
        {key: 'mountSpeed', name: 'Mount speed'},
        {key: 'playedTime', name: 'Played time'},
        {key: 'restedExperience', name: 'Rested XP'},
        {key: 'statusIcons', name: 'Status icons'},
        {key: 'torghast', name: 'Torghast'},
        {key: 'vaultMythicPlus', name: 'Vault - Mythic+'},
        {key: 'vaultPvp', name: 'Vault - PvP'},
        {key: 'vaultRaid', name: 'Vault - Raid'},
        {key: 'weeklyAnima', name: 'Weekly - Anima'},
        {key: 'weeklyKorthia', name: 'Weekly - Korthia'},
        {key: 'weeklySouls', name: 'Weekly - Souls'},
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
    h3 {
        border-top: 1px dotted $border-color;
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

        <h3>Character Table</h3>

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
