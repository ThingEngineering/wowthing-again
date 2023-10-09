<script lang="ts">
    import mdiDown from '@iconify/icons-mdi/arrow-down-bold-circle-outline'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
</script>

<style lang="scss">
    .sorted-by {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        color: $colour-success;
        pointer-events: none;

        & :global(svg) {
            --scale: 1.3 !important;
        }
    }
</style>

<div class="sorted-by drop-shadow">
    <IconifyIcon icon={mdiDown} />
</div>
