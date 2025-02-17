<script lang="ts">
    import find from 'lodash/find'
    import { afterUpdate } from 'svelte'

    import { staticStore } from '@/shared/stores/static'
    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './Sidebar.svelte'
    import Table from './Table.svelte'

    export let slug: string

    const allProfessions = Object.values($staticStore.professions)
    allProfessions.sort((a, b) => a.name.localeCompare(b.name))

    afterUpdate(() => getSavedRoute('professions/overview', slug))
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
    {:else}
        <Table profession={find(allProfessions, (prof) => prof.slug === slug)} />
    {/if}
</div>
