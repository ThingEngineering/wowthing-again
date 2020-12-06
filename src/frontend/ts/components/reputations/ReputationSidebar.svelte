<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { data as staticData } from '../../stores/static-store'
    import SubSidebar from '../common/SubSidebar.svelte'
</script>

<SubSidebar>
    {#each $staticData.ReputationSets as reputation}
        <li use:active={'/reputations/' + reputation.Slug}>
            <a href="/reputations/{ reputation.Slug }" use:link>{ reputation.Name }</a>
        </li>
    {/each}
</SubSidebar>
