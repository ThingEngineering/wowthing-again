<script lang="ts">
    import Router from 'svelte-spa-router'

    import Team from '../../components/team/Team.svelte'

    // TODO: this is pretty jank, come up with a better way to do this
    const routes = {
        '/': Team,
        '/gear': Team,
        '/mythic-plus': Team,
    }
</script>

<Router {routes} />
