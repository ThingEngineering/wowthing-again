<script lang="ts">
    import { Faction } from '@/enums/faction';
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import Entry from './TooltipReputationHeaderEntry.svelte';

    let { reputation }: { reputation: ManualDataReputationSet } = $props();
</script>

<style lang="scss">
    div :global(table + table) {
        margin-top: 1rem;
    }
</style>

<div class="wowthing-tooltip">
    {#if reputation.both}
        <Entry reputation={reputation.both} set={reputation} />
    {:else}
        {#if reputation.alliance}
            <Entry faction={Faction.Alliance} reputation={reputation.alliance} set={reputation} />
        {/if}

        {#if reputation.horde}
            <Entry faction={Faction.Horde} reputation={reputation.horde} set={reputation} />
        {/if}
    {/if}
</div>
