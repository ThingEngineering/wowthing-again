<script lang="ts">
    import { iconStrings } from '@/data/icons';
    import { browserState } from '@/shared/state/browser.svelte';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    let filters = $derived.by(() => {
        let byType1: string[] = [];
        let byType2: string[] = [];
        let byThing: string[] = [];
        let bySet: string[] = [];

        if (browserState.current.vendors.showCloth) {
            byType1.push('C');
        }
        if (browserState.current.vendors.showLeather) {
            byType1.push('L');
        }
        if (browserState.current.vendors.showMail) {
            byType1.push('M');
        }
        if (browserState.current.vendors.showPlate) {
            byType1.push('P');
        }

        if (byType1.length === 0) {
            byType1 = ['---'];
        } else if (byType1.length === 4) {
            byType1 = ['ALL'];
        }

        if (browserState.current.vendors.showCloaks) {
            byType2.push('C');
        }
        if (browserState.current.vendors.showCosmetics) {
            byType2.push('O');
        }
        if (browserState.current.vendors.showWeapons) {
            byType2.push('W');
        }

        if (byType2.length === 0) {
            byType2 = ['---'];
        } else if (byType2.length === 3) {
            byType2 = ['ALL'];
        }

        if (browserState.current.vendors.showDragonriding) {
            byThing.push('D');
        }
        if (browserState.current.vendors.showIllusions) {
            byThing.push('I');
        }
        if (browserState.current.vendors.showMounts) {
            byThing.push('M');
        }
        if (browserState.current.vendors.showPets) {
            byThing.push('P');
        }
        if (browserState.current.vendors.showRecipes) {
            byThing.push('R');
        }
        if (browserState.current.vendors.showToys) {
            byThing.push('T');
        }

        if (byThing.length === 0) {
            byThing = ['---'];
        } else if (byThing.length === 6) {
            byThing = ['ALL'];
        }

        if (browserState.current.vendors.showPvp) {
            bySet.push('P');
        }
        if (browserState.current.vendors.showTier) {
            bySet.push('T');
        }
        if (browserState.current.vendors.showAwakened) {
            bySet.push('A');
        }

        if (bySet.length === 0) {
            bySet = ['---'];
        } else if (bySet.length === 3) {
            bySet = ['ALL'];
        }

        return `${byType1.join('')} | ${byType2.join('')} | ${byThing.join('')} | ${bySet.join('')}`;
    });
</script>

<style lang="scss">
    .filters-toggle {
        margin-left: auto;
        margin-right: 0;
        padding-left: 0.5rem;

        :global(svg) {
            margin-top: -4px;
        }
    }
    .filters-container {
        justify-content: flex-end;
        margin-top: -0.25rem;

        button {
            background: #24282f;
            margin-right: 0;

            &:not(:last-child) {
                margin-right: -1px;
            }
        }
    }
    .margin-left {
        margin-left: 0.75rem;
    }
</style>

<div class="options-container">
    <button>
        <CheckboxInput
            name="highlight_missing"
            bind:value={browserState.current.vendors.highlightMissing}
            >Highlight missing</CheckboxInput
        >
    </button>

    <span>Show:</span>

    <button>
        <CheckboxInput name="show_collected" bind:value={browserState.current.vendors.showCollected}
            >Collected</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_collected_prices"
            disabled={!browserState.current.vendors.showCollected}
            bind:value={browserState.current.vendors.showCollectedPrices}
            >Collected Prices</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_uncollected"
            bind:value={browserState.current.vendors.showUncollected}>Missing</CheckboxInput
        >
    </button>

    <button
        class="filters-toggle"
        onclick={() =>
            (browserState.current.vendors.filtersExpanded =
                !browserState.current.vendors.filtersExpanded)}
    >
        Filters: {filters}

        <IconifyIcon
            icon={iconStrings[
                'chevron-' + (browserState.current.vendors.filtersExpanded ? 'down' : 'right')
            ]}
        />
    </button>
</div>

{#if browserState.current.vendors.filtersExpanded}
    <div class="options-container filters-container">
        <span>Types:</span>

        <button>
            <CheckboxInput name="show_cloth" bind:value={browserState.current.vendors.showCloth}
                >Cloth</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_leather" bind:value={browserState.current.vendors.showLeather}
                >Leather</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_mail" bind:value={browserState.current.vendors.showMail}
                >Mail</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_plate" bind:value={browserState.current.vendors.showPlate}
                >Plate</CheckboxInput
            >
        </button>

        <button class="margin-left">
            <CheckboxInput name="show_cloaks" bind:value={browserState.current.vendors.showCloaks}
                >Cloaks</CheckboxInput
            >
        </button>
        <button>
            <CheckboxInput
                name="show_cosmetics"
                bind:value={browserState.current.vendors.showCosmetics}>Cosmetics</CheckboxInput
            >
        </button>
        <button>
            <CheckboxInput name="show_weapons" bind:value={browserState.current.vendors.showWeapons}
                >Weapons</CheckboxInput
            >
        </button>
    </div>

    <div class="options-container filters-container">
        <span>Things:</span>

        <button>
            <CheckboxInput
                name="show_dragonriding"
                bind:value={browserState.current.vendors.showDragonriding}
                >Dragonriding</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput
                name="show_illusions"
                bind:value={browserState.current.vendors.showIllusions}>Illusions</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_mounts" bind:value={browserState.current.vendors.showMounts}
                >Mounts</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_pets" bind:value={browserState.current.vendors.showPets}
                >Pets</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_recipes" bind:value={browserState.current.vendors.showRecipes}
                >Recipes</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_toys" bind:value={browserState.current.vendors.showToys}
                >Toys</CheckboxInput
            >
        </button>
    </div>

    <div class="options-container filters-container">
        <span>Sets:</span>

        <button>
            <CheckboxInput name="show_pvp" bind:value={browserState.current.vendors.showPvp}
                >PvP</CheckboxInput
            >
        </button>

        <button>
            <CheckboxInput name="show_tier" bind:value={browserState.current.vendors.showTier}
                >Tier</CheckboxInput
            >
        </button>

        <button class="margin-left">
            <CheckboxInput
                name="show_awakened"
                bind:value={browserState.current.vendors.showAwakened}>Awakened</CheckboxInput
            >
        </button>
    </div>
{/if}
