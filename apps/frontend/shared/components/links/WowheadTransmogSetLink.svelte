<script lang="ts">
    import type { Snippet } from 'svelte';

    import { settingsState } from '@/shared/state/settings.svelte';

    type Props = {
        children?: Snippet;
        cls?: string;
        id: number;
    };
    let { children, cls = '', id }: Props = $props();

    let url = $derived(`https://${settingsState.wowheadBaseUrl}/transmog-set=${id}`);
</script>

<style lang="scss">
    a {
        display: block;
    }
</style>

<a href={url} class={cls}>
    {@render children?.()}
</a>
