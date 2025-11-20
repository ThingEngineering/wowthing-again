<script lang="ts">
    import type { ParamsSlugsProps } from '@/types/props';
    import { everythingData } from './data';

    import Something from './Something.svelte';

    let { params }: ParamsSlugsProps = $props();
</script>

{#if everythingData[params.slug1]}
    <Something slug={params.slug1} thing={everythingData[params.slug1]} />
{:else}
    <p>uh-oh</p>
{/if}
