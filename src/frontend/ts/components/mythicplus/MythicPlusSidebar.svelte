<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import Sidebar from '../common/Sidebar.svelte'
    import {seasonMap} from '../../data/dungeon'

    const seasons = sortBy(seasonMap, (s) => -s.Id)
</script>

<Sidebar>
    <li use:active={'/mythicplus/thisweek'}>
        <a href="/mythicplus/thisweek" use:link>This Week</a>
    </li>
    <li class="separator"></li>
    {#each seasons as season}
        <li use:active={`/mythicplus/season${season.Id}`}>
            <a href="/mythicplus/season{season.Id}" use:link>Season {season.Id}</a>
        </li>
    {/each}
</Sidebar>
