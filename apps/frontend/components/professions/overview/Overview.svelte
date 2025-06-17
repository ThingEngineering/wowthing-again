<script lang="ts">
    import find from 'lodash/find';

    import { professionOrder } from '@/data/professions';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import getSavedRoute from '@/utils/get-saved-route';

    import Sidebar from './Sidebar.svelte';
    import Table from './Table.svelte';

    let { slug }: { slug: string } = $props();

    const allProfessions = professionOrder.map((id) => wowthingData.static.professionById.get(id));

    $effect(() => getSavedRoute('professions/overview', slug));
</script>

<style lang="scss">
    .view {
        :global(table > tbody > tr > td.name) {
            width: 10rem;
        }
    }
</style>

<div class="view">
    <Sidebar />

    {#if slug === 'all'}
        <div class="wrapper-column">
            {#each allProfessions as profession (profession.id)}
                <Table {profession} />
            {/each}
        </div>
    {:else if slug === 'collectors'}
        <div class="wrapper-column">
            {#each allProfessions.filter((p) => p.slug !== 'archaeology') as profession (profession.id)}
                {@const characterIds =
                    settingsState.value.professions.collectingCharactersV2[profession.id]}
                {#if characterIds?.length > 0}
                    <Table {profession} {characterIds} />
                {/if}
            {/each}
        </div>
    {:else}
        <Table profession={find(allProfessions, (prof) => prof.slug === slug)} />
    {/if}
</div>
