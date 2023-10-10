<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { journalState, type JournalState } from '@/stores/local-storage'

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'


    function getFilters(state: JournalState): string {
        let byType: string[] = []
        let byMisc: string[] = []
        let byDungeon: string[] = []
        let byRaid: string[] = []

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

        if (byType.length === 0 || byType.length === 4) {
            byType = ['ALL']
        }

        if (state.showCloaks) {
            byMisc.push('C')
        }
        if (state.showTrash) {
            byMisc.push('T')
        }
        if (state.showWeapons) {
            byMisc.push('W')
        }

        if (byMisc.length === 0 || byMisc.length === 3) {
            byMisc = ['ALL']
        }

        if (state.showDungeonNormal) {
            byDungeon.push('N')
        }
        if (state.showDungeonHeroic) {
            byDungeon.push('H')
        }
        if (state.showDungeonMythic) {
            byDungeon.push('M')
        }
        if (state.showDungeonTimewalking) {
            byDungeon.push('T')
        }

        if (byDungeon.length === 0 || byDungeon.length === 4) {
            byDungeon = ['ALL']
        }

        if (state.showRaidLfr) {
            byRaid.push('L')
        }
        if (state.showRaidNormal) {
            byRaid.push('N')
        }
        if (state.showRaidHeroic) {
            byRaid.push('H')
        }
        if (state.showRaidMythic) {
            byRaid.push('M')
        }
        if (state.showRaidMythicOld) {
            byRaid.push('O')
        }
        if (state.showRaidTimewalking) {
            byRaid.push('T')
        }

        if (byRaid.length === 0 || byRaid.length === 6) {
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

    <button class="margin-left">
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
