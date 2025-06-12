<script lang="ts">
    import { afterUpdate } from 'svelte';
    import active from 'svelte-spa-router/active';

    import { userState } from '@/user-home/state/user';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { Guild } from '@/types';

    import Tab from './Tab.svelte';

    export let slug1: string;
    export let slug2: string;

    let guild: Guild;
    let maxTab: number;
    $: {
        const [realmSlug, guildSlug] = slug1.split('--', 2);
        guild = Object.values(userState.general.guildById).find(
            (guild) => guild.realm.slug === realmSlug && guild.slug === guildSlug
        );

        maxTab = Math.max(0, ...(guild?.items || []).map((item) => item.tabId));
    }

    afterUpdate(() => {
        getSavedRoute(`items/guild-banks/${slug1}`, slug2, null, null, 'guild-banks-subnav');
    });
</script>

<style lang="scss">
    .thing-container {
        background: mix($thing-background, $color-fail, 90%);
        padding: 0.75rem;
    }
    .flex-wrapper {
        flex-wrap: wrap;
        justify-content: start;
        margin-left: -0.75rem;
    }
</style>

{#if guild}
    {#if maxTab}
        {#key `guild-banks-${guild.id}`}
            <div class="column">
                <nav class="subnav" id="guild-banks-subnav">
                    <a href="#/items/guild-banks/{slug1}/all" use:active>All</a>
                    {#each { length: maxTab }, tabIndex}
                        <a href="#/items/guild-banks/{slug1}/tab-{tabIndex + 1}" use:active
                            >Tab {tabIndex + 1}</a
                        >
                    {/each}
                </nav>

                {#if slug2}
                    <div class="flex-wrapper">
                        {#if slug2 === 'all'}
                            {#each { length: maxTab }, tabIndex}
                                <Tab {guild} tab={tabIndex + 1} />
                            {/each}
                        {:else if slug2.startsWith('tab-')}
                            <Tab {guild} tab={parseInt(slug2.split('-')[1])} />
                        {/if}
                    </div>
                {/if}
            </div>
        {/key}
    {:else}
        <div class="thing-container border">
            No tabs found for this guild, visit the guild bank and upload addon data.
        </div>
    {/if}
{/if}
