<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { data as staticData } from '../../stores/static'

    import Sidebar from '@/components/common/Sidebar.svelte'
</script>

<Sidebar width="12rem">
    {#each $staticData.ReputationSets as reputation}
        <li use:active={'/reputations/' + reputation.Slug}>
            <a href="/reputations/{ reputation.Slug }" use:link>{ reputation.Name }</a>
        </li>
    {/each}
</Sidebar>
