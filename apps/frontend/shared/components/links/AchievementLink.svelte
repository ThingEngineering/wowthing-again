<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    export let id: number;

    let url = '';
    $: {
        if (settingsState.value.general.useWowdb) {
            url = `https://www.wowdb.com/achievements/${id}`;
        } else {
            url = `https://${settingsState.wowheadBaseUrl}/achievement=${id}`;
        }
    }
</script>

<a href={url}>
    <slot />
</a>
