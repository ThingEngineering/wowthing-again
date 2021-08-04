<script lang="ts">
    import { link } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { data as staticData } from '@/stores/static'

    import Sidebar from '@/components/common/Sidebar.svelte'
</script>

<Sidebar width="12rem">
    {#each $staticData.reputationSets as reputation}
        <li use:active={'/reputations/' + reputation.slug}>
            <a href="/reputations/{reputation.slug}" use:link
                >{reputation.name}</a
            >
        </li>
    {/each}
</Sidebar>
