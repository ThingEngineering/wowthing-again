<script lang="ts">
    import { link } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { categoryOrder } from '@/data/currencies'
    import { staticStore } from '@/stores/static'

    import Sidebar from '@/components/common/Sidebar.svelte'

    const categories = categoryOrder.map((id) => $staticStore.data.currencyCategories[id])
</script>

<Sidebar width="12rem">
    {#each categories as category}
        <li use:active={'/currencies/' + category.slug}>
            <a href="/currencies/{category.slug}" use:link
            >{category.name}</a
            >
        </li>
    {/each}
</Sidebar>
