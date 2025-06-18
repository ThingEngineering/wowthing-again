<script lang="ts">
    import { iconStrings } from '@/data/icons';
    import { browserState } from '@/shared/state/browser.svelte';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    let filterText = $derived(() => {
        const state = browserState.current.journal;

        let byType = [
            state.showCloth ? 'C' : '-',
            state.showLeather ? 'L' : '-',
            state.showMail ? 'M' : '-',
            state.showPlate ? 'P' : '-',
            state.showCloaks ? 'B' : '-',
            state.showWeapons ? 'W' : '-',
        ];
        if (!byType.some((c) => c === '-')) {
            byType = ['ALL'];
        }

        let byMisc = [
            state.showMounts ? 'M' : '-',
            state.showPets ? 'P' : '-',
            state.showRecipes ? 'R' : '-',
            state.showTokens ? 'O' : '-',
            state.showTrash ? 'T' : '-',
        ];
        if (!byMisc.some((c) => c === '-')) {
            byMisc = ['ALL'];
        }

        let byDungeon = [
            state.showDungeonNormal ? 'N' : '-',
            state.showDungeonHeroic ? 'H' : '-',
            state.showDungeonMythic ? 'M' : '-',
            state.showDungeonTimewalking ? 'T' : '-',
        ];
        if (!byDungeon.some((c) => c === '-')) {
            byDungeon = ['ALL'];
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
            byRaid = ['ALL'];
        }

        return `${byType.join('')} | ${byMisc.join('')} | ${byDungeon.join('')} | ${byRaid.join('')}`;
    });
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
            bind:value={browserState.current.journal.highlightMissing}
            >Highlight missing</CheckboxInput
        >
    </button>

    <span>Show:</span>

    <button>
        <CheckboxInput name="show_collected" bind:value={browserState.current.journal.showCollected}
            >Collected</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_uncollected"
            bind:value={browserState.current.journal.showUncollected}>Missing</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_lockouts" bind:value={browserState.current.journal.showLockouts}
            >Lockouts</CheckboxInput
        >
    </button>

    <button
        class="filters-toggle"
        onclick={() =>
            (browserState.current.journal.filtersExpanded =
                !browserState.current.journal.filtersExpanded)}
    >
        Filters: {filterText}

        <IconifyIcon
            icon={iconStrings[
                'chevron-' + (browserState.current.journal.filtersExpanded ? 'down' : 'right')
            ]}
        />
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={browserState.current.journal.filtersExpanded ? null : 'none'}
>
    <button>
        <CheckboxInput name="show_cloth" bind:value={browserState.current.journal.showCloth}
            >Cloth</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_leather" bind:value={browserState.current.journal.showLeather}
            >Leather</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_mail" bind:value={browserState.current.journal.showMail}
            >Mail</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_plate" bind:value={browserState.current.journal.showPlate}
            >Plate</CheckboxInput
        >
    </button>

    <button class="margin-left">
        <CheckboxInput name="show_cloaks" bind:value={browserState.current.journal.showCloaks}
            >Cloaks</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_weapons" bind:value={browserState.current.journal.showWeapons}
            >Weapons</CheckboxInput
        >
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={browserState.current.journal.filtersExpanded ? null : 'none'}
>
    <button>
        <CheckboxInput name="show_mounts" bind:value={browserState.current.journal.showMounts}
            >Mounts</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_pets" bind:value={browserState.current.journal.showPets}
            >Pets</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_recipes" bind:value={browserState.current.journal.showRecipes}
            >Recipes</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_tokens" bind:value={browserState.current.journal.showTokens}
            >Tokens</CheckboxInput
        >
    </button>

    <button class="margin-left">
        <CheckboxInput name="show_trash" bind:value={browserState.current.journal.showTrash}
            >Trash Drops</CheckboxInput
        >
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={browserState.current.journal.filtersExpanded ? null : 'none'}
>
    <span>Dungeons:</span>

    <button>
        <CheckboxInput
            name="show_dungeon_normal"
            bind:value={browserState.current.journal.showDungeonNormal}>Normal</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_dungeon_heroic"
            bind:value={browserState.current.journal.showDungeonHeroic}>Heroic</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_dungeon_mythic"
            bind:value={browserState.current.journal.showDungeonMythic}>Mythic</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_dungeon_timewalking"
            bind:value={browserState.current.journal.showDungeonTimewalking}
            >Timewalking</CheckboxInput
        >
    </button>
</div>

<div
    class="options-container filters-container"
    style:display={browserState.current.journal.filtersExpanded ? null : 'none'}
>
    <span>Raids:</span>

    <button>
        <CheckboxInput name="show_raid_lfr" bind:value={browserState.current.journal.showRaidLfr}
            >LFR</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_raid_normal"
            bind:value={browserState.current.journal.showRaidNormal}>Normal</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_raid_heroic"
            bind:value={browserState.current.journal.showRaidHeroic}>Heroic</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_raid_mythic"
            bind:value={browserState.current.journal.showRaidMythic}>Mythic</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_raid_mythic_old"
            bind:value={browserState.current.journal.showRaidMythicOld}>Mythic (Old)</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput
            name="show_raid_timewalking"
            bind:value={browserState.current.journal.showRaidTimewalking}>Timewalking</CheckboxInput
        >
    </button>

    <button class="margin-left">
        <CheckboxInput name="show_raid_10" bind:value={browserState.current.journal.showRaid10}
            >10 Player</CheckboxInput
        >
    </button>

    <button>
        <CheckboxInput name="show_raid_25" bind:value={browserState.current.journal.showRaid25}
            >25 Player</CheckboxInput
        >
    </button>
</div>
