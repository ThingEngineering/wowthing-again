<script lang="ts">
    import type { ChildrenProp } from '@/types/props';

    import { settingsState } from '@/shared/state/settings.svelte';

    type Props = ChildrenProp & {
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
