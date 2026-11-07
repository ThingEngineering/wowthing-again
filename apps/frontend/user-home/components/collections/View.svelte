<script lang="ts">
    import { setBasePathContext } from '@/shared/contexts/basePath';

    import Routes from './Routes.svelte';

    setBasePathContext(() => 'collections');
</script>

<div>
    <Routes />
</div>
