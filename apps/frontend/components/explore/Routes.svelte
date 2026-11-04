<script lang="ts">
    import Router from 'svelte-spa-router';

    import Achievements from './Achievements.svelte';
    import BonusIDs from './BonusIDs.svelte';
    import Chett from './Chett.svelte';
    import Icons from './Icons.svelte';
    import ModifierTrees from './ModifierTrees.svelte';
    import Quests from './Quests.svelte';
    import Transmog from './Transmog.svelte';

    const routes = {
        '/achievements': Achievements,
        '/bonus-ids': BonusIDs,
        '/chett': Chett,
        '/icons': Icons,
        '/modifier-trees': ModifierTrees,
        '/quests': Quests,
        '/transmog': Transmog,
    };
</script>

<Router prefix="/explore" {routes} />
