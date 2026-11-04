<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Routes from './Routes.svelte';
    import Sidebar from './Sidebar.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('explore', params.slug1));
</script>

<style lang="scss">
    div {
        :global(.thing-container) {
            padding: 1rem;
            width: 100%;

            :global(input) {
                width: 10rem;
            }
        }
    }
</style>

<Sidebar />
<Routes />
