<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    type Props = { id: number };
    let { id }: Props = $props();

    let url = $derived(
        settingsState.value.general.useWowdb
            ? `https://www.wowdb.com/achievements/${id}`
            : `https://${settingsState.wowheadBaseUrl}/achievement=${id}`
    );
</script>

<a href={url}>
    <slot />
</a>
