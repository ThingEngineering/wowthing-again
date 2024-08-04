<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { VendorState, vendorState } from '@/stores/local-storage'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'


    function getFilters(state: VendorState): string {
        let byType1: string[] = []
        let byType2: string[] = []
        let byThing: string[] = []
        let bySet: string[] = []

        if (state.showCloth) {
            byType1.push('C')
        }
        if (state.showLeather) {
            byType1.push('L')
        }
        if (state.showMail) {
            byType1.push('M')
        }
        if (state.showPlate) {
            byType1.push('P')
        }

        if (byType1.length === 0) {
            byType1 = ['---']
        }
        else if (byType1.length === 4) {
            byType1 = ['ALL']
        }

        if (state.showCloaks) {
            byType2.push('C')
        }
        if (state.showWeapons) {
            byType2.push('W')
        }

        if (byType2.length === 0) {
            byType2 = ['---']
        }
        else if (byType2.length === 2) {
            byType2 = ['ALL']
        }

        if (state.showIllusions) {
            byThing.push('I')
        }
        if (state.showMounts) {
            byThing.push('M')
        }
        if (state.showPets) {
            byThing.push('P')
        }
        if (state.showToys) {
            byThing.push('T')
        }

        if (byThing.length === 0) {
            byThing = ['---']
        }
        else if (byThing.length === 4) {
            byThing = ['ALL']
        }

        if (state.showPvp) {
            bySet.push('P')
        }
        if (state.showTier) {
            bySet.push('T')
        }
        if (state.showAwakened) {
            bySet.push('A')
        }

        if (bySet.length === 0) {
            bySet = ['---']
        }
        else if (bySet.length === 3) {
            bySet = ['ALL']
        }

        return `${byType1.join('')} | ${byType2.join('')} | ${byThing.join('')} | ${bySet.join('')}`
    }
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
            bind:value={$vendorState.highlightMissing}
        >Highlight missing</CheckboxInput>
    </button>

    <span>Show:</span>

    <button>
        <CheckboxInput
            name="show_collected"
            bind:value={$vendorState.showCollected}
        >Collected</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_uncollected"
            bind:value={$vendorState.showUncollected}
        >Missing</CheckboxInput>
    </button>
        
    <button class="filters-toggle"
        on:click={() => $vendorState.filtersExpanded = !$vendorState.filtersExpanded}
    >
        Filters: {getFilters($vendorState)}

        <IconifyIcon
            icon={iconStrings['chevron-' + ($vendorState.filtersExpanded ? 'down' : 'right')]}
        />
    </button>
</div>

{#if $vendorState.filtersExpanded}
    <div class="options-container filters-container">
        <span>Types:</span>

        <button>
            <CheckboxInput
                name="show_cloth"
                bind:value={$vendorState.showCloth}
            >Cloth</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_leather"
                bind:value={$vendorState.showLeather}
            >Leather</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_mail"
                bind:value={$vendorState.showMail}
            >Mail</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_plate"
                bind:value={$vendorState.showPlate}
            >Plate</CheckboxInput>
        </button>

        <button class="margin-left">
            <CheckboxInput
                name="show_cloaks"
                bind:value={$vendorState.showCloaks}
            >Cloaks</CheckboxInput>
        </button>
        <button>
            <CheckboxInput
                name="show_weapons"
                bind:value={$vendorState.showWeapons}
            >Weapons</CheckboxInput>
        </button>
    </div>

    <div class="options-container filters-container">
        <span>Things:</span>

        <button>
            <CheckboxInput
                name="show_illusions"
                bind:value={$vendorState.showIllusions}
            >Illusions</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_mounts"
                bind:value={$vendorState.showMounts}
            >Mounts</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_pets"
                bind:value={$vendorState.showPets}
            >Pets</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_recipes"
                bind:value={$vendorState.showRecipes}
            >Recipes</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_toys"
                bind:value={$vendorState.showToys}
            >Toys</CheckboxInput>
        </button>
    </div>

    <div class="options-container filters-container">
        <span>Sets:</span>

        <button>
            <CheckboxInput
                name="show_pvp"
                bind:value={$vendorState.showPvp}
            >PvP</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_tier"
                bind:value={$vendorState.showTier}
            >Tier</CheckboxInput>
        </button>

        <button class="margin-left">
            <CheckboxInput
                name="show_awakened"
                bind:value={$vendorState.showAwakened}
            >Awakened</CheckboxInput>
        </button>
    </div>
{/if}
