<script lang="ts">
    import debounce from 'lodash/debounce'
    import sortBy from 'lodash/sortBy'

    import { ignoredLockoutInstances } from '@/data/dungeon'
    import { expansionMap } from '@/data/expansion'
    import { staticStore } from '@/shared/stores/static'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'

    export let active: boolean
    export let view: SettingsView

    let instanceFilter: string

    const lockoutChoices: SettingsChoice[] = sortBy(
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

    const lockoutActive = view.homeLockouts
        .map((f) => lockoutChoices.filter((c) => parseInt(c.key) === f)[0])
        .filter(f => f !== undefined)
    
    $: lockoutInactive = lockoutChoices.filter(
        (instance) => lockoutActive.indexOf(instance) === -1 &&
            (
                !instanceFilter ||
                instance.name.toLocaleLowerCase().indexOf(instanceFilter.toLocaleLowerCase()) >= 0
            )
    )

    const onLockoutChange = debounce(() => {
        view.homeLockouts = lockoutActive.map((c) => parseInt(c.key))
    }, 100)
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
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
    <h3>
        Lockouts
        {#if !active}
            <span>add to Home columns to configure</span>
        {/if}
    </h3>

    {#if active}
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
            onFunc={onLockoutChange}
            active={lockoutActive}
            inactive={lockoutInactive}
        />
    {/if}
</div>
