<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[] = $derived.by(() => [
        {
            name: 'Account',
            slug: 'account',
        },
        {
            name: 'Leaderboard',
            slug: 'leaderboard',
        },
        {
            name: 'Privacy',
            slug: 'privacy',
        },
        null,
        {
            name: 'Layout',
            slug: 'layout',
        },
        {
            name: 'Tags',
            slug: 'tags',
        },
        {
            name: 'Tasks',
            slug: 'tasks',
        },
        {
            name: 'Views',
            slug: 'views',
            children: (settingsState.value.views || []).map((view) => ({
                name: view.name,
                slug: view.id,
            })),
        },
        null,
        {
            name: 'Characters',
            slug: 'characters',
            children: [
                {
                    name: 'Pin',
                    slug: 'pin',
                },
                {
                    name: 'Toggles',
                    slug: 'toggles',
                },
            ],
        },
        null,
        {
            name: 'Achievements',
            slug: 'achievements',
        },
        {
            name: 'Auctions',
            slug: 'auctions',
            children: [
                {
                    name: 'Custom Categories',
                    slug: 'custom',
                },
            ],
        },
        {
            name: 'Collections',
            slug: 'collections',
        },
        {
            name: 'History',
            slug: 'history',
        },
        {
            name: 'Professions',
            slug: 'professions',
        },
        {
            name: 'Transmog',
            slug: 'transmog',
        },
    ]);
</script>

<style lang="scss">
    .state {
        padding: 0.5rem;
        text-align: center;
        width: 100%;
    }
</style>

<Sidebar alwaysExpand={true} baseUrl="/settings" items={categories} width="10rem">
    <svelte:fragment slot="after">
        <div class="state">
            {#if settingsState.saving === 1}
                Saving...
            {:else if settingsState.saving === 2}
                Saved!
            {/if}
        </div>
    </svelte:fragment>
</Sidebar>
