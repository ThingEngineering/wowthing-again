<script lang="ts">
    import { tick } from 'svelte';

    import { professionSlugToId } from '@/data/professions';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { Character } from '@/types';
    import { someProfessions } from './some';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import Row from './TableRow.svelte';
    import Sidebar from './Sidebar.svelte';

    let { slug }: { slug: string } = $props();

    let professionId = $derived(professionSlugToId[slug] || 0);

    const filterFunc = (char: Character): boolean => {
        if (slug === 'all') {
            return true;
        } else if (slug === 'some') {
            return someProfessions.some((id) => !!char.professions?.[id]);
        } else {
            return !!char.professions?.[professionId];
        }
    };

    $effect.pre(() => {
        tick().then(() => getSavedRoute('professions/equipment', slug));
    });
</script>

<Sidebar />

{#if slug === 'all' || slug === 'some' || professionId}
    <CharacterTable {filterFunc} skipIgnored={true}>
        <svelte:fragment slot="rowExtra" let:character>
            <Row {character} {professionId} {slug} />
        </svelte:fragment>
    </CharacterTable>
{/if}
