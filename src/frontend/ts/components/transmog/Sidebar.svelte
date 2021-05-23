<script lang="ts">
    import {link} from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import Sidebar from '../common/Sidebar.svelte'
</script>

<Sidebar width="12rem">
        <li use:active={'/transmog/adhf'}>
            <a href="/transmog/adhf" use:link>Adhf</a>
        </li>
</Sidebar>
