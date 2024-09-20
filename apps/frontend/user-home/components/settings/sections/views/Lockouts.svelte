<script lang="ts">
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

    let lockoutChoices: SettingsChoice[]
    $: {
        const lowerFilter = (instanceFilter || '').toLocaleLowerCase();
        lockoutChoices = sortBy(
            Object.values($staticStore.instances)
                .filter((instance) => instance !== null &&
                    !ignoredLockoutInstances[instance.id] &&
                    instance.name.toLocaleLowerCase().includes(lowerFilter)),
            (instance) => instance.expansion
        ).map((instance) => ({
            id: instance.id.toString(),
            name: instance.expansion === 100
                ? `[Event] ${instance.name}`
                : `[${expansionMap[instance.expansion].shortName}] ${instance.name}`,
            })
        )
    }
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

{#if active}
    <div class="settings-block">
        <h3>Lockouts</h3>

        <div class="magic-filter">
            <TextInput
                name="filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={instanceFilter}
            />
        </div>

        <MagicLists
            key="lockouts"
            choices={lockoutChoices}
            bind:activeNumberIds={view.homeLockouts}
        />
    </div>
{/if}
