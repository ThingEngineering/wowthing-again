<script lang="ts">
    import active from 'svelte-spa-router/active';

    import { userState } from '@/user-home/state/user';
    import getSavedRoute from '@/utils/get-saved-route';
    import { groupBankItems } from '@/utils/items/group-bank-items';
    import type { MultiSlugParams } from '@/types';

    import BankTab from '../BankTab.svelte';

    let { slug1, slug2 }: MultiSlugParams = $props();

    let guild = $derived.by(() => {
        const [realmSlug, guildSlug] = slug1.split('--', 2);
        return Object.values(userState.general.guildById).find(
            (guild) => guild.realm.slug === realmSlug && guild.slug === guildSlug
        );
    });
    let guildItems = $derived(guild?.items || []);
    let maxTab = $derived(Math.max(0, ...guildItems.map((item) => item.tabId)));
    let groupedItems = $derived(groupBankItems(guildItems));

    $effect(() => {
        getSavedRoute(`items/guild-banks/${slug1}`, slug2, null, null, 'guild-banks-subnav');
    });
</script>

<style lang="scss">
    .thing-container {
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
                                <BankTab {groupedItems} tab={tabIndex + 1} />
                            {/each}
                        {:else if slug2.startsWith('tab-')}
                            <BankTab {groupedItems} tab={parseInt(slug2.split('-')[1])} />
                        {/if}
                    </div>
                {/if}
            </div>
        {/key}
    {:else}
        <div class="thing-container bg-fail border">
            No tabs found for this guild, visit the guild bank and upload addon data.
        </div>
    {/if}
{/if}
