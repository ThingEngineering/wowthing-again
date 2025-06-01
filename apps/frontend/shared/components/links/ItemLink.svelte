<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    export let id: number;
    export let bonusIds: number[] = [];

    let url = '';
    const params: Map<string, string> = new Map<string, string>();
    $: {
        if (settingsState.value.general.useWowdb) {
            url = `https://www.wowdb.com/items/${id}`;
            if (bonusIds.length > 0) {
                params.set('bonusIDs', bonusIds.join(','));
            }
        } else {
            url = `https://${settingsState.wowheadBaseUrl}/item=${id}`;
        }

        // attach params
    }
</script>

<a href={url}>
    <slot />
</a>
