<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import { browserState } from '@/shared/state/browser.svelte';

    let { sortedProfessions }: { sortedProfessions: StaticDataProfession[] } = $props();

    let categories = $derived([
        {
            name: 'All',
            slug: 'all',
        },
        {
            name: 'Collectors',
            slug: 'collectors',
        },
        null,
        ...sortedProfessions.map((prof) => ({
            name: `:profession-${prof.id}: ${prof.name.split('|')[0]}`,
            slug: prof.slug,
        })),
    ] as SidebarItem[]);
</script>

<Sidebar baseUrl="/professions/patron-orders" items={categories} width="10rem">
    <svelt:fragment slot="after">
        <CheckboxInput
            name="patron_unknown"
            bind:value={browserState.current.professions.patronOrdersUnknown}
        >
            Unknown recipes
        </CheckboxInput>
    </svelt:fragment>
</Sidebar>
