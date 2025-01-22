<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { journalState, type JournalState } from '@/stores/local-storage'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'


    function getFilters(state: JournalState): string {
        let byType = [
            state.showCloth ? 'C' : '-',
            state.showLeather ? 'L' : '-',
            state.showMail ? 'M' : '-',
            state.showPlate ? 'P' : '-',
            state.showCloaks ? 'B' : '-',
            state.showWeapons ? 'W' : '-',
        ]
        if (!byType.some((c) => c === '-')) {
            byType = ['ALL']
        }

        let byMisc = [
            state.showMounts ? 'M' : '-',
            state.showPets ? 'P' : '-',
            state.showRecipes ? 'R' : '-',
            state.showTrash ? 'T' : '-',
        ]
        if (!byMisc.some((c) => c === '-')) {
            byMisc = ['ALL']
        }

        let byDungeon = [
            state.showDungeonNormal ? 'N' : '-',
            state.showDungeonHeroic ? 'H' : '-',
            state.showDungeonMythic ? 'M' : '-',
            state.showDungeonTimewalking ? 'T' : '-',
        ];
        if (!byDungeon.some((c) => c === '-')) {
            byDungeon = ['ALL']
        }

        let byRaid = [
            state.showRaidLfr ? 'L' : '-',
            state.showRaidNormal ? 'N' : '-',
            state.showRaidHeroic ? 'H' : '-',
            state.showRaidMythic ? 'M' : '-',
            state.showRaidMythicOld ? 'O' : '-',
            state.showRaidTimewalking ? 'T' : '-',
            state.showRaid10 ? '10' : '-',
            state.showRaid25 ? '25' : '-',
        ];
        if (!byRaid.some((c) => c === '-')) {
            byRaid = ['ALL']
        }

        return `${byType.join('')} | ${byMisc.join('')} | ${byDungeon.join('')} | ${byRaid.join('')}`
    }
</script>

<style lang="scss">
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
            margin-right: 0;

            &:not(:last-child) {
                margin-right: -1px;
            }
        }
    }
</style>

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

    <button>
        <CheckboxInput
            name="show_lockouts"
            bind:value={$journalState.showLockouts}
        >Lockouts</CheckboxInput>
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

<div
    class="options-container filters-container"
    style:display={$journalState.filtersExpanded ? null : 'none'}
>
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

    <button class="margin-left">
        <CheckboxInput
            name="show_cloaks"
            bind:value={$journalState.showCloaks}
        >Cloaks</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_weapons"
            bind:value={$journalState.showWeapons}
        >Weapons</CheckboxInput>
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={$journalState.filtersExpanded ? null : 'none'}
>
    <button>
        <CheckboxInput
            name="show_mounts"
            bind:value={$journalState.showMounts}
        >Mounts</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_pets"
            bind:value={$journalState.showPets}
        >Pets</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_recipes"
            bind:value={$journalState.showRecipes}
        >Recipes</CheckboxInput>
    </button>
    
    <button>
        <CheckboxInput
            name="show_trash"
            bind:value={$journalState.showTrash}
        >Trash Drops</CheckboxInput>
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={$journalState.filtersExpanded ? null : 'none'}
>
    <span>Dungeons:</span>

    <button>
        <CheckboxInput
            name="show_dungeon_normal"
            bind:value={$journalState.showDungeonNormal}
        >Normal</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_dungeon_heroic"
            bind:value={$journalState.showDungeonHeroic}
        >Heroic</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_dungeon_mythic"
            bind:value={$journalState.showDungeonMythic}
        >Mythic</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_dungeon_timewalking"
            bind:value={$journalState.showDungeonTimewalking}
        >Timewalking</CheckboxInput>
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={$journalState.filtersExpanded ? null : 'none'}
>
    <span>Raids:</span>

    <button>
        <CheckboxInput
            name="show_raid_lfr"
            bind:value={$journalState.showRaidLfr}
        >LFR</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_raid_normal"
            bind:value={$journalState.showRaidNormal}
        >Normal</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_raid_heroic"
            bind:value={$journalState.showRaidHeroic}
        >Heroic</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_raid_mythic"
            bind:value={$journalState.showRaidMythic}
        >Mythic</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_raid_mythic_old"
            bind:value={$journalState.showRaidMythicOld}
        >Mythic (Old)</CheckboxInput>
    </button>

    <button>
        <CheckboxInput
            name="show_raid_timewalking"
            bind:value={$journalState.showRaidTimewalking}
        >Timewalking</CheckboxInput>
    </button>
    
    <button class="margin-left">
        <CheckboxInput
            name="show_raid_10"
            bind:value={$journalState.showRaid10}
        >10 Player</CheckboxInput>
    </button>
    
    <button>
        <CheckboxInput
            name="show_raid_25"
            bind:value={$journalState.showRaid25}
        >25 Player</CheckboxInput>
    </button>
</div>
