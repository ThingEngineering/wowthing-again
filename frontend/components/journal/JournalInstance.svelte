<script lang="ts">
    import find from 'lodash/find'

    import { journalStore } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import type { JournalDataInstance, JournalDataTier } from '@/types/data'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import CollectionCount from '@/components/collections/CollectionCount.svelte'
    import Group from './JournalGroup.svelte'

    export let slug1: string
    export let slug2: string

    let instance: JournalDataInstance
    $: {
        const tier: JournalDataTier = find($journalStore.data.tiers, (tier) => tier.slug === slug1)
        if (tier) {
            instance = find(tier.instances, (instance) => instance.slug === slug2)
        }
    }
</script>

<style lang="scss">
    button {
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        margin-left: 0.25rem;

        &.margin-left {
            margin-left: 0.75rem;
        }
    }
    .wrapper {
        width: 100%;
    }
    .toggles {
        align-items: center;
        display: flex;
        margin-bottom: calc(0.75rem - 1px);
    }
    .show {
        margin-left: 0.5rem;
    }
</style>

<div class="wrapper">
    <div class="toggles">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={$journalState.highlightMissing}
            >Highlight missing</CheckboxInput>
        </button>

        <span class="show">Show:</span>

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

        <button class="margin-left">
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
                name="show_weapons"
                bind:value={$journalState.showWeapons}
            >Weapons</CheckboxInput>
        </button>

        <button class="margin-left">
            <CheckboxInput
                name="show_timewalking"
                bind:value={$journalState.showTimewalking}
            >Timewalking</CheckboxInput>
        </button>
    </div>

    {#if instance}
        <div class="collection thing-container">
            {#each instance.encounters as encounter}
                <h3>
                    {encounter.name}
                    <CollectionCount
                        counts={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}`]} />
                </h3>
                <div class="collection-section">
                    {#each encounter.groups as group}
                        <Group
                            bonusIds={instance.bonusIds}
                            stats={$journalStore.data.stats[`${slug1}--${slug2}--${encounter.name}--${group.name}`]}
                            {group}
                        />
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
