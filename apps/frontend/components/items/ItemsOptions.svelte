<script lang="ts">
    import { gearState } from '@/stores/local-storage'

    import CheckboxInput from '@/shared/forms/CheckboxInput.svelte'
    import NumberInput from '@/shared/forms/NumberInput.svelte'

    export let slug: string
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
        background: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        display: flex;
        padding-left: 0.2rem;
        padding-right: 0.2rem;

        :global(input[type="number"]) {
            margin: 0;
            padding: 0 0.2rem;
            width: 3.5rem;
        }
    }
</style>

{#if slug === 'bags' || slug === 'equipped'}
    <div class="items-options">
        <span>Highlight:</span>

        {#if slug === 'bags'}
            <button>
                <CheckboxInput
                    name="highlight_item_level"
                    bind:value={$gearState.highlightBagSize}
                >Bag slots &lt;</CheckboxInput>
                <NumberInput
                    name="minimum_item_level"
                    bind:value={$gearState.minimumBagSize}
                    disabled={!$gearState.highlightBagSize}
                    minValue={0}
                    maxValue={50}
                />
            </button>
        
        {:else if slug === 'equipped'}
            <button>
                <CheckboxInput
                    name="highlight_item_level"
                    bind:value={$gearState.highlightItemLevel}
                >Item level &lt;</CheckboxInput>
                <NumberInput
                    name="minimum_item_level"
                    bind:value={$gearState.minimumItemLevel}
                    disabled={!$gearState.highlightItemLevel}
                    minValue={0}
                    maxValue={999}
                />
            </button>

            <button>
                <CheckboxInput
                    name="highlight_enchants"
                    bind:value={$gearState.highlightEnchants}
                >Missing enchants</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="highlight_gems"
                    bind:value={$gearState.highlightGems}
                >Missing gems</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="highlight_heirlooms"
                    bind:value={$gearState.highlightHeirlooms}
                >Missing heirlooms</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="highlight_upgrades"
                    bind:value={$gearState.highlightUpgrades}
                >Upgradeable</CheckboxInput>
            </button>
        {/if}
    </div>
{/if}
