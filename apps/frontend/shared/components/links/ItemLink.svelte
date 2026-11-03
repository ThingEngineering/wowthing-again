<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { ChildrenProp } from '@/types/props';

    type Props = ChildrenProp & {
        id: number;
        // bonusIds?: number[];
    };
    let { id, children }: Props = $props();

    let url = $derived(
        settingsState.value.general.useWowdb
            ? `https://www.wowdb.com/items/${id}`
            : `https://${settingsState.wowheadBaseUrl}/item=${id}`
    );
</script>

<a href={url}>
    {@render children?.()}
</a>
