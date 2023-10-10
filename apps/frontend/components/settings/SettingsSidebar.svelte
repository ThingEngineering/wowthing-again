<script lang="ts">
    import { settingsSavingState } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    export const categories: SidebarItem[] = [
        {
            name: 'Account',
            slug: 'account',
        },
        {
            name: 'Layout',
            slug: 'layout',
            children: [
                {
                    name: 'Lockouts',
                    slug: 'lockouts',
                },
                {
                    name: 'Tasks',
                    slug: 'tasks',
                },
                null,
                {
                    name: 'Grouping',
                    slug: 'grouping',
                },
                {
                    name: 'Views',
                    slug: 'views',
                },
            ],
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
            name: 'Characters',
            slug: 'characters',
            children: [
                {
                    name: 'Pin',
                    slug: 'pin',
                },
                {
                    name: 'Sort',
                    slug: 'sort',
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
                }
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
    ]
</script>

<style lang="scss">
    .state {
        padding: 0.5rem;
        text-align: center;
        width: 100%;
    }
</style>

<Sidebar
    alwaysExpand={true}
    baseUrl="/settings"
    items={categories}
    width="10rem"
>
    <svelte:fragment slot="after">
        <div class="state">
            {#if $settingsSavingState === 1}
                Saving...
            {:else if $settingsSavingState === 2}
                Saved!
            {/if}
        </div>
    </svelte:fragment>
</Sidebar>
