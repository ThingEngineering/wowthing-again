<script lang="ts">
    import { settingsState } from '@/stores'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte';

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
                    name: 'Grouping',
                    slug: 'grouping',
                },
                {
                    name: 'Lockouts',
                    slug: 'lockouts',
                },
                {
                    name: 'Tasks',
                    slug: 'tasks',
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
            {#if $settingsState === 1}
                Saving...
            {:else if $settingsState === 2}
                Saved!
            {/if}
        </div>
    </svelte:fragment>
</Sidebar>
