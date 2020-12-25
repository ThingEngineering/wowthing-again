<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import Sidebar from '../common/Sidebar.svelte'
</script>

<Sidebar>
    <li use:active={'/settings/accounts'}>
        <a href="/settings/accounts" use:link>Accounts</a>
    </li>
</Sidebar>
