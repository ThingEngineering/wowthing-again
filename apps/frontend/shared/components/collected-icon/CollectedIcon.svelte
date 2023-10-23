<script lang="ts">
    import IconifyIcon from '../images/IconifyIcon.svelte'

    import { iconLibrary } from '@/shared/icons'
</script>

<style lang="scss">
    .collected-icon {
        color: $color-success;
        pointer-events: none;
        position: absolute;
        top: -4px;
        right: -2px;
    }
</style>

<div class="collected-icon drop-shadow">
    <IconifyIcon icon={iconLibrary.mdiCheckboxOutline} />
</div>
