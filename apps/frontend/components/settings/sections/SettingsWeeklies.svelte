<script lang='ts'>
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'

    import { data as settingsData } from '@/stores/settings'
    import type { SettingsChoice } from '@/types'

    import MagicLists from '../SettingsMagicLists.svelte'
 
    const weeklyChoices: SettingsChoice[] = [
        { key: 'holidayArenaSkirmishes', name: 'Holiday - Arena Skirmishes' },
        { key: 'holidayBattlegrounds', name: 'Holiday - Battlegrounds' },
        { key: 'holidayDungeons', name: 'Holiday - Mythic Dungeons' },
        { key: 'holidayPetBattles', name: 'Holiday - Pet Battles' },
        { key: 'holidayTimewalking', name: 'Holiday - Timewalking' },
        { key: 'holidayWorldQuests', name: 'Holiday - World Quests' },

        { key: 'slAnima', name: 'Shadowlands - Anima' },
        { key: 'slKorthia', name: 'Shadowlands - Korthia' },
        { key: 'slZerethMortis', name: 'Shadowlands - Zereth Mortis' },
    ]

    const weeklyActive = $settingsData.layout.homeWeeklies.map(
        (f) => filter(weeklyChoices, (c) => c.key === f)[0]
    )
    const weeklyInactive = filter(weeklyChoices, (c) => weeklyActive.indexOf(c) < 0)

    const onWeeklyChange = debounce(() => {
        settingsData.update(state => {
            state.layout.homeWeeklies = weeklyActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<div class='thing-container settings-container'>
    <h2>Weeklies</h2>

    <p>
        <code>Holiday</code> weeklies will only show that column when that holiday is active.
        You'll also need to add <code>Weeklies</code> to <code>Home columns</code> in
        <a href='#/settings/layout'>Settings->Layout</a>.
    </p>
    <MagicLists
        key='lockouts'
        title='Lockouts'
        onFunc={onWeeklyChange}
        active={weeklyActive}
        inactive={weeklyInactive}
    />
</div>
