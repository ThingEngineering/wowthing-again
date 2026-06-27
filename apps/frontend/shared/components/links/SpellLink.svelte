<script lang="ts">
    import type { ChildrenProp } from '@/types/props';

    import { settingsState } from '@/shared/state/settings.svelte';

    type Props = ChildrenProp & {
        id: number;
        itemLevel?: number;
    };
    let { children, id, itemLevel = 0 }: Props = $props();

    let url = $derived.by(() => {
        let ret: string;
        if (settingsState.value.general.useWowdb) {
            ret = `https://www.wowdb.com/spells/${id}`;
        } else {
            ret = `https://${settingsState.wowheadBaseUrl}/spell=${id}`;
            if (itemLevel > 0) {
                ret += `?ilvl=${itemLevel}`;
            }
        }
        return ret;
    });
</script>

<a href={url}>
    {@render children?.()}
</a>
