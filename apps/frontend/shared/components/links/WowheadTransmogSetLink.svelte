<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    export let cls = '';
    export let id: number;

    let url: string;
    $: {
        url = `https://${settingsState.wowheadBaseUrl}/transmog-set=${id}`;
    }
</script>

<style lang="scss">
    a {
        display: block;
    }
</style>

<a href={url} class={cls}>
    <slot />
</a>
