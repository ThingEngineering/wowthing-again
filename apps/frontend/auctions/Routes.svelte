<script lang="ts">
    import Router from 'svelte-spa-router';
    import { wrap } from 'svelte-spa-router/wrap';

    import Browse from './components/browse/Browse.svelte';
    import Search from './components/search/Search.svelte';

    let { baseUrlPrefix }: { baseUrlPrefix?: string } = $props();

    let routes = $derived.by(() => {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const ret = new Map();

        ret.set(
            `${baseUrlPrefix || ''}/browse/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?`,
            wrap({
                component: Browse,
                props: {
                    baseUrlPrefix,
                },
            })
        );
        ret.set(
            `${baseUrlPrefix || ''}/search/:slug1?/:slug2?/:slug3?`,
            wrap({
                component: Search,
                props: {
                    baseUrlPrefix,
                },
            })
        );

        return ret;
    });
</script>

<Router {routes} />
