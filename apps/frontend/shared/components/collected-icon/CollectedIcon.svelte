<script lang="ts">
    import IconifyIcon from '../images/IconifyIcon.svelte';

    import { iconLibrary } from '@/shared/icons';

    let { soon = false }: { soon?: boolean } = $props();
</script>

<style lang="scss">
    .collected-icon {
        pointer-events: none;
        position: absolute;
        top: var(--collected-top, -4px);
        right: var(--collected-right, -2px);
    }
</style>

<div class="collected-icon drop-shadow2" class:status-success={!soon} class:status-shrug={soon}>
    <IconifyIcon icon={soon ? iconLibrary.gameClockwork : iconLibrary.mdiCheckboxOutline} />
</div>
