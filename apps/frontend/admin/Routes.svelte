<script lang="ts">
    import Router from 'svelte-spa-router'

    import RenameRequests from './components/rename-requests/RenameRequests.svelte'
    
    const routes = {
        '/rename-requests': RenameRequests,
    }
</script>

<Router {routes} />
