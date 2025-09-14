<script lang="ts">
    import { iconLibrary } from '@/shared/icons';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
</script>

<style lang="scss">
    .sorted-by {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        color: var(--color-success);
        pointer-events: none;

        & :global(svg) {
            --scale: 1.3 !important;
        }
    }
</style>

<div class="sorted-by drop-shadow">
    <IconifyIcon icon={iconLibrary.mdiArrowDownBoldCircleOutline} />
</div>
