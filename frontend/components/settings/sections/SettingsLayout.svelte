<script lang="ts">
    import { faArrowsAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'
    import Fa from 'svelte-fa'
    import ListView from 'svelte-sortable-flat-list-view'

    import {data as settingsData} from '@/stores/settings'

    import HomeTable from '@/components/home/HomeTable.svelte'

    const commonChoices = [
        {key: 'accountTag', name: 'Account tag', first: true},
        {key: 'characterLevel', name: 'Character level', first: true},
        {key: 'characterName', name: 'Character name', first: true},
        {key: 'characterIconClass', name: 'Icon - Class', first: true},
        {key: 'characterIconRace', name: 'Icon - Race', first: true},
        {key: 'characterIconSpec', name: 'Icon - Specialization', first: true},
        {key: 'realmName', name: 'Realm name', first: true},
    ]
    const homeChoices = [
        {key: 'gold', name: 'Gold'},
        {key: 'covenant', name: 'Covenant'},
        {key: 'itemLevel', name: 'Item level'},
        {key: 'keystone', name: 'Mythic+ keystone'},
        {key: 'mountSpeed', name: 'Mount speed'},
        {key: 'playedTime', name: 'Played time'},
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
    const commonAvailable = filter(commonChoices, (c) => commonActive.indexOf(c) < 0)

    const homeActive = $settingsData.layout.homeFields.map(
        (f) => filter(homeChoices, (c) => c.key === f)[0]
    )
    const homeAvailable = filter(homeChoices, (c) => homeActive.indexOf(c) < 0)

    const keyFunc = (item) => item.key

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
    .wrapper {
        display: flex;
        gap: 0.5rem;

        & :global(svg) {
            margin-right: -4px;
        }
        & :global(.column:first-child svg) {
            color: $colour-success;
        }
        & :global(.column:last-child svg) {
            color: $colour-fail;
        }
    }

    .columns {
        flex: 1;

        h3 {
            text-align: center;
        }
    }

    .column {
        display: flex;
        flex: 1;
        flex-direction: column;

        & :global(.defaultListView) {
            background: $highlight-background;
            border: 1px solid $border-color;
            border-radius: $border-radius;
            flex: 1;
            width: 100%;

            & :global(.ListItemView) {
                animation: none !important;
            }

            & :global(.selected:not(.dragged)) {
                background: $active-background !important;
            }

            & :global(svg) {
                color: #8cf;
                margin-top: 7px;
            }
        }
    }
</style>

<div>
    <div class="thing-container settings-container">
        <h2>Layout</h2>

        <p>
            Drag items between the two lists on the left to control the layout of the
            "common" information shown on many tables. Drag items between the two lists
            on the right to control the extra columns that Home uses.
        </p>

        <div class="wrapper">
            <div class="columns">
                <h3>
                    Common columns
                </h3>
                <div class="wrapper">
                    <div class="column">
                        <ListView
                            Key={keyFunc}
                            List={commonActive}
                            Operations="copy"
                            PanSpeed={0}
                            SelectionLimit={1}
                            DataToOffer={{ 'item/common': '' }}
                            TypesToAccept={{ 'item/common': 'all' }}
                            sortable={true}
                            withTransitions={false}
                            on:inserted-items={onCommonChange}
                            on:removed-items={onCommonChange}
                            on:sorted-items={onCommonChange}
                            let:Item
                        >
                            {Item.name}
                            <Fa fw icon={faCheck} pull="right" />
                        </ListView>
                    </div>

                    <div class="column">
                        <ListView
                            Key={keyFunc}
                            List={commonAvailable}
                            Operations="copy"
                            PanSpeed={0}
                            SelectionLimit={1}
                            DataToOffer={{ 'item/common': '' }}
                            TypesToAccept={{ 'item/common': 'all' }}
                            sortable={true}
                            withTransitions={false}
                            let:Item
                        >
                            {Item.name}
                            <Fa fw icon={faTimes} pull="right" />
                        </ListView>
                    </div>
                </div>
            </div>

            <div class="columns">
                <h3>Home columns</h3>
                <div class="wrapper">
                    <div class="column">
                        <ListView
                            Key={keyFunc}
                            List={homeActive}
                            Operations="copy"
                            PanSpeed={0}
                            SelectionLimit={1}
                            DataToOffer={{ 'item/home': '' }}
                            TypesToAccept={{ 'item/home': 'all' }}
                            sortable={true}
                            withTransitions={false}
                            on:inserted-items={onHomeChange}
                            on:removed-items={onHomeChange}
                            on:sorted-items={onHomeChange}
                            let:Item
                        >
                            {Item.name}
                            <Fa fw icon={faCheck} pull="right" />
                        </ListView>
                    </div>

                    <div class="column">
                        <ListView
                            Key={keyFunc}
                            List={homeAvailable}
                            Operations="copy"
                            PanSpeed={0}
                            SelectionLimit={1}
                            DataToOffer={{ 'item/home': '' }}
                            TypesToAccept={{ 'item/home': 'all' }}
                            sortable={true}
                            withTransitions={false}
                            let:Item
                        >
                            {Item.name}
                            <Fa fw icon={faTimes} pull="right" />
                        </ListView>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <HomeTable characterLimit={2} />
</div>
