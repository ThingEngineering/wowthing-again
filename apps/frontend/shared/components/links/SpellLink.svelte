<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    export let id: number;
    export let itemLevel = 0;

    let url = '';
    $: {
        if (settingsState.value.general.useWowdb) {
            url = `https://www.wowdb.com/spells/${id}`;
        } else {
            url = `https://${settingsState.wowheadBaseUrl}/spell=${id}`;
            if (itemLevel > 0) {
                url += `?ilvl=${itemLevel}`;
            }
        }
    }
</script>

<a href={url}>
    <slot />
</a>
