<script lang="ts">
    import find from 'lodash/find';
    import { afterUpdate } from 'svelte';

    import { professionOrder } from '@/data/professions';
    import { settingsStore } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import getSavedRoute from '@/utils/get-saved-route';

    import Sidebar from './Sidebar.svelte';
    import Table from './Table.svelte';

    export let slug: string;

    $: allProfessions = professionOrder.map((id) => $staticStore.professions[id]);

    afterUpdate(() => getSavedRoute('professions/overview', slug));
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
            {#each allProfessions as profession}
                <Table {profession} />
            {/each}
        </div>
    {:else if slug === 'collectors'}
        <div class="wrapper-column">
            {#each allProfessions.filter((p) => p.slug !== 'archaeology') as profession}
                {@const characterIds =
                    $settingsStore.professions.collectingCharactersV2[profession.id]}
                {#if characterIds?.length > 0}
                    <Table {profession} {characterIds} />
                {/if}
            {/each}
        </div>
    {:else}
        <Table profession={find(allProfessions, (prof) => prof.slug === slug)} />
    {/if}
</div>
