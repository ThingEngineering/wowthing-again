<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import SubSidebar from '../common/SubSidebar.svelte'
</script>

<SubSidebar>
    <li use:active={'/settings/accounts'}>
        <a href="/settings/accounts" use:link>Accounts</a>
    </li>
</SubSidebar>
