<script lang="ts">
    import { Faction } from '@/types/enums'
    import type { StaticDataReputationSet } from '@/types/data/static'

    import Entry from './TooltipReputationHeaderEntry.svelte'

    export let reputation: StaticDataReputationSet
</script>

<style lang="scss">
    div :global(table + table) {
        margin-top: 1rem;
    }
</style>

<div class="wowthing-tooltip">
    {#if reputation.both}
        <Entry
            reputation={reputation.both}
            set={reputation}
        />
    {:else}
        <Entry
            faction={Faction.Alliance}
            reputation={reputation.alliance}
            set={reputation}
        />
        <Entry
            faction={Faction.Horde}
            reputation={reputation.horde}
            set={reputation}
        />
    {/if}
</div>
