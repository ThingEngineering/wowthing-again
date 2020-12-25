<script lang="ts">
    import Router from 'svelte-spa-router'

    import Gear from '../../components/team/Gear.svelte'

    const routes = {
        '/': Gear,
        '/gear': Gear,
    }
</script>

<Router {routes} />
