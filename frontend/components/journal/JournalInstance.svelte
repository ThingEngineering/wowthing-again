<script lang="ts">
    import find from 'lodash/find'

    import { iconStrings } from '@/data/icons'
    import { journalStore } from '@/stores'
    import { JournalState, journalState } from '@/stores/local-storage'
    import type { JournalDataInstance, JournalDataTier } from '@/types/data'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Group from './JournalGroup.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'

    export let slug1: string
    export let slug2: string

    let instance: JournalDataInstance
    $: {
        instance = undefined
        const tier: JournalDataTier = find($journalStore.data.tiers, (tier) => tier.slug === slug1)
        if (tier) {
            instance = find(tier.instances, (instance) => instance.slug === slug2)
        }
    }

    function getFilters(state: JournalState): string {
        let byType: string[] = []
        let byDifficulty: string[] = []

        if (state.showCloth) {
            byType.push('C')
        }
        if (state.showLeather) {
            byType.push('L')
        }
        if (state.showMail) {
            byType.push('M')
        }
        if (state.showPlate) {
            byType.push('P')
        }
        if (state.showTrash) {
            byType.push('T')
        }
        if (state.showWeapons) {
            byType.push('W')
        }

        if (byType.length === 0 || byType.length === 6) {
            byType = ['ALL']
        }

        if (state.showLfr) {
            byDifficulty.push('L')
        }
        if (state.showNormal) {
            byDifficulty.push('N')
        }
        if (state.showHeroic) {
            byDifficulty.push('H')
        }
        if (state.showMythic) {
            byDifficulty.push('M')
        }
        if (state.showTimewalking) {
            byDifficulty.push('T')
        }

        if (byDifficulty.length === 0 || byDifficulty.length === 5) {
            byDifficulty = ['ALL']
        }

        return `${byType.join('')} | ${byDifficulty.join('')}`
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .filters-toggle {
        margin-left: auto;
        margin-right: 0;

        :global(svg) {
            margin-top: -4px;
        }
    }
    .filters-container {
        justify-content: flex-end;
        margin-top: -0.25rem;

        button {
            background: #24282f;
            margin-left: -1px;
            margin-right: 0;
        }
    }
</style>

<div class="wrapper">
    <div class="options-container">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={$journalState.highlightMissing}
            >Highlight missing</CheckboxInput>
        </button>

        <span>Show:</span>

        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={$journalState.showCollected}
            >Collected</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={$journalState.showUncollected}
            >Missing</CheckboxInput>
        </button>

        <button class="filters-toggle"
            on:click={() => $journalState.filtersExpanded = !$journalState.filtersExpanded}
        >
            Filters: {getFilters($journalState)}

            <IconifyIcon
                icon={iconStrings['chevron-' + ($journalState.filtersExpanded ? 'down' : 'right')]}
            />
        </button>
    </div>

    {#if $journalState.filtersExpanded}
        <div class="options-container filters-container">
            <button>
                <CheckboxInput
                    name="show_cloth"
                    bind:value={$journalState.showCloth}
                >Cloth</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_leather"
                    bind:value={$journalState.showLeather}
                >Leather</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_mail"
                    bind:value={$journalState.showMail}
                >Mail</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_plate"
                    bind:value={$journalState.showPlate}
                >Plate</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_trash"
                    bind:value={$journalState.showTrash}
                >Trash Drops</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_weapons"
                    bind:value={$journalState.showWeapons}
                >Weapons</CheckboxInput>
            </button>
        </div>

        <div class="options-container filters-container">
            <button>
                <CheckboxInput
                    name="show_lfr"
                    bind:value={$journalState.showLfr}
                >LFR</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_normal"
                    bind:value={$journalState.showNormal}
                >Normal</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_heroic"
                    bind:value={$journalState.showHeroic}
                >Heroic</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_mythic"
                    bind:value={$journalState.showMythic}
                >Mythic</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_timewalking"
                    bind:value={$journalState.showTimewalking}
                >Timewalking</CheckboxInput>
            </button>
        </div>
    {/if}

    {#if instance}
        {#key instance.id}
            <div class="collection thing-container">
                {#each instance.encounters as encounter, encounterIndex}
                    {#key encounterIndex}
                        {#if $journalState.showTrash || encounter.name !== 'Trash Drops'}
                            <SectionTitle
                                title={encounter.name}
                                count={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}`]}
                            />
                            <div class="collection-section">
                                {#each encounter.groups as group}
                                    <Group
                                        bonusIds={instance.bonusIds}
                                        stats={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}--${group.name}`]}
                                        {group}
                                    />
                                {/each}
                            </div>
                        {/if}
                    {/key}
                {/each}
            </div>
        {/key}
    {/if}
</div>
