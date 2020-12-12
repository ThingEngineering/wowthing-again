<script lang="ts">
    import Router from 'svelte-spa-router'

    import SettingsAccount from './SettingsAccount.svelte'

    const prefix = '/settings'
    const routes = {
        '/accounts': SettingsAccount,
    }
</script>

<Router {prefix} {routes} />
