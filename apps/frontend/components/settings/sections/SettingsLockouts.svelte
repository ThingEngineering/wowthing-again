<script lang="ts">
    import debounce from 'lodash/debounce'
    import sortBy from 'lodash/sortBy'

    import { ignoredLockoutInstances } from '@/data/dungeon'
    import { expansionMap } from '@/data/expansion'
    import { iconStrings } from '@/data/icons'
    import { staticStore } from '@/stores'
    import { settingsStore } from '@/stores'
    import type { SettingsChoice } from '@/types'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import MagicLists from '../SettingsMagicLists.svelte'
    import TextInput from '@/components/forms/TextInput.svelte'

    let instanceFilter: string

    const allInstances: SettingsChoice[] = sortBy(
        Object.values($staticStore.instances)
            .filter((instance) => instance !== null && !ignoredLockoutInstances[instance.id]),
        (instance) => instance.expansion
    ).map((instance) => ({
        key: instance.id.toString(),
        name: instance.expansion === 100
            ? `[Event] ${instance.name}`
            : `[${expansionMap[instance.expansion].shortName}] ${instance.name}`,
    })
)

    let inactiveInstances: SettingsChoice[]
    const activeInstance = sortBy(
        allInstances.filter(
            (instance) => $settingsStore.layout.homeLockouts.indexOf(parseInt(instance.key)) >= 0
        ),
        (instance) => $settingsStore.layout.homeLockouts.indexOf(parseInt(instance.key))
    )

    $: {
        inactiveInstances = allInstances.filter(
            (instance) => (
                $settingsStore.layout.homeLockouts.indexOf(parseInt(instance.key)) === -1 &&
                (
                    !instanceFilter ||
                    instance.name.toLocaleLowerCase().indexOf(instanceFilter.toLocaleLowerCase()) >= 0
                )
            )
        )
    }

    const onFunc = debounce(() => {
        settingsStore.update(state => {
            state.layout.homeLockouts = activeInstance.map((c) => parseInt(c.key))
            return state
        })
    }, 100)

</script>

<style lang="scss">
    .filter-instances {
        position: relative;

        :global(fieldset) {
            background: $highlight-background;
            bottom: -2.6rem;
            position: absolute;
            right: -4px;
            width: 12rem;
        }
    }
</style>

<div class="settings-block">
    <h3>Settings</h3>

    <div class="setting setting-checkbox setting-layout">
        <CheckboxInput
            bind:value={$settingsStore.layout.showEmptyLockouts}
            name="layout_showEmptyLockouts"
        >Show a <span class="status-fail"><IconifyIcon icon={iconStrings.starHalf} /></span> for empty lockouts.</CheckboxInput>
    </div>

    <h3>Lockouts</h3>

    <p>
        Search for instances and add them to the left list to have them show up under Lockouts.
        You'll also need to add <code>Lockouts</code> to <code>Home columns</code> in
        <a href="#/settings/layout">Settings->Layout</a>.
    </p>

    <div class="filter-instances">
        <TextInput
            name="filter"
            maxlength={20}
            placeholder="Search..."
            bind:value={instanceFilter}
        />
    </div>

    <MagicLists
        key="lockouts"
        title="Lockouts"
        onFunc={onFunc}
        active={activeInstance}
        inactive={inactiveInstances}
    />
</div>
