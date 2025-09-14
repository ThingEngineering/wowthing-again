<script lang="ts">
    import { InventorySlot } from '@/enums/inventory-slot';
    import { browserState } from '@/shared/state/browser.svelte';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';
    import Select from '@/shared/components/forms/Select.svelte';

    let { slug }: { slug: string } = $props();

    const slotOptions = [
        [0, 'Any slot'],
        [InventorySlot.MainHand, 'Main/Off Hand'],
        [InventorySlot.Head, 'Head'],
        [InventorySlot.Neck, 'Neck'],
        [InventorySlot.Shoulders, 'Shoulders'],
        [InventorySlot.Back, 'Back'],
        [InventorySlot.Chest, 'Chest'],
        [InventorySlot.Wrist, 'Wrists'],
        [InventorySlot.Hands, 'Hands'],
        [InventorySlot.Waist, 'Waist'],
        [InventorySlot.Legs, 'Legs'],
        [InventorySlot.Feet, 'Feet'],
        [InventorySlot.Ring1, 'Rings'],
        [InventorySlot.Trinket1, 'Trinkets'],
    ] as [number, string][];
</script>

<style lang="scss">
    .items-options {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    span {
        margin-right: 0.3rem;
    }
    button {
        align-items: center;
        background: var(--color-highlight-background);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        display: flex;
        padding-left: 0.2rem;
        padding-right: 0.2rem;

        :global(input[type='number']) {
            margin: 0;
            padding: 0 0.2rem;
            width: 3.5rem;
        }
    }
    .equipped-options {
        gap: 0.1rem;
    }
</style>

{#if slug === 'bags' || slug === 'equipped'}
    <div class="items-options">
        <span>Highlight:</span>

        {#if slug === 'bags'}
            <button>
                <CheckboxInput
                    name="highlight_bag_size"
                    bind:value={browserState.current.items.highlightBagSize}
                    >Bag slots &lt;</CheckboxInput
                >
                <NumberInput
                    name="minimum_bag_size"
                    bind:value={browserState.current.items.minimumBagSize}
                    disabled={!browserState.current.items.highlightBagSize}
                    minValue={0}
                    maxValue={50}
                />
            </button>
        {:else if slug === 'equipped'}
            <button class="equipped-options flex-wrapper">
                <CheckboxInput
                    name="highlight_item_level"
                    bind:value={browserState.current.items.highlightItemLevel}
                    >Item level</CheckboxInput
                >
                <Select
                    name="item_level_slot"
                    bind:selected={browserState.current.items.itemLevelSlot}
                    disabled={!browserState.current.items.highlightItemLevel}
                    width="8rem"
                    options={slotOptions}
                />
                <Select
                    name="item_level_comparison"
                    bind:selected={browserState.current.items.itemLevelComparison}
                    disabled={!browserState.current.items.highlightItemLevel}
                    width="4rem"
                    options={[
                        ['<', '<'],
                        ['<=', '<='],
                        ['=', '='],
                        ['>=', '>='],
                        ['>', '>'],
                    ]}
                />
                <NumberInput
                    name="item_level_value"
                    bind:value={browserState.current.items.itemLevelValue}
                    disabled={!browserState.current.items.highlightItemLevel}
                    minValue={0}
                    maxValue={999}
                />
            </button>

            <button>
                <CheckboxInput
                    name="highlight_enchants"
                    bind:value={browserState.current.items.highlightEnchants}
                    >Missing enchants</CheckboxInput
                >
            </button>

            <button>
                <CheckboxInput
                    name="highlight_gems"
                    bind:value={browserState.current.items.highlightGems}
                    >Missing gems</CheckboxInput
                >
            </button>

            <button>
                <CheckboxInput
                    name="highlight_heirlooms"
                    bind:value={browserState.current.items.highlightHeirlooms}
                    >Missing heirlooms</CheckboxInput
                >
            </button>

            <button>
                <CheckboxInput
                    name="highlight_upgrades"
                    bind:value={browserState.current.items.highlightUpgrades}
                    >Upgradeable</CheckboxInput
                >
            </button>
        {/if}
    </div>
{/if}
