<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import Sidebar from '../common/Sidebar.svelte'
</script>

<Sidebar>
    <li use:active={'/mythicplus/thisweek'}>
        <a href="/mythicplus/thisweek" use:link>This Week</a>
    </li>
    <li class="separator"></li>
    <li use:active={'/mythicplus/season5'}>
        <a href="/mythicplus/season5" use:link>Season 5</a>
    </li>
</Sidebar>
