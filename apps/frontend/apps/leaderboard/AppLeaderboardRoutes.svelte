<script lang="ts">
    import Router from 'svelte-spa-router'
    
    import Leaderboard from '@/components/leaderboard/Leaderboard.svelte'

    const routes = {
        '/:slug1?/:slug2?': Leaderboard,
    }
</script>

<Router {routes} />
