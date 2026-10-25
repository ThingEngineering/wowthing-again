<script lang="ts">
    import active from 'svelte-spa-router/active';

    import { userState } from '@/user-home/state/user';
    import getSavedRoute from '@/utils/get-saved-route';
    import { groupBankItems } from '@/utils/items/group-bank-items';
    import type { MultiSlugParams } from '@/types';

    import BankTab from '../BankTab.svelte';

    let { slug1 }: MultiSlugParams = $props();

    let groupedItems = $derived(groupBankItems(userState.general.warbankItems));

    $effect(() => {
        getSavedRoute(`items/warbank`, slug1, null, null, 'warbank-subnav');
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

<div class="column">
    <nav class="subnav" id="warbank-subnav">
        <a href="#/items/warbank/all" use:active>All</a>
        {#each { length: 5 }, tabIndex}
            <a href="#/items/warbank/tab-{tabIndex + 1}" use:active>Tab {tabIndex + 1}</a>
        {/each}
    </nav>

    {#if slug1}
        <div class="flex-wrapper">
            {#if slug1 === 'all'}
                {#each { length: 5 }, tabIndex}
                    <BankTab {groupedItems} tab={tabIndex + 1} tabIndexOffByOne={true} />
                {/each}
            {:else if slug1.startsWith('tab-')}
                <BankTab
                    {groupedItems}
                    tab={parseInt(slug1.split('-')[1])}
                    tabIndexOffByOne={true}
                />
            {/if}
        </div>
    {/if}
</div>
