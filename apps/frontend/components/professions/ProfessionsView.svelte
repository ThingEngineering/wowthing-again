<script lang="ts">
    import find from 'lodash/find'

    import { staticStore } from '@/stores'

    import Table from './ProfessionsTable.svelte'

    export let slug: string

    const allProfessions = Object.values($staticStore.professions)
    allProfessions.sort((a, b) => a.name.localeCompare(b.name))
</script>

<style lang="scss">
    .professions-wrapper {
        :global(div + div) {
            margin-top: 1rem;
        }
        :global(table > tbody > tr > td.name) {
            width: 10rem;
        }
    }
</style>

<div class="professions-wrapper">
    {#if slug === 'all'}
        {#each allProfessions as profession}
            <Table {profession} />
        {/each}
    {:else}
        <Table profession={find(allProfessions, (prof) => prof.slug === slug)} />
    {/if}
</div>
