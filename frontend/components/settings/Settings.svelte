<script lang="ts">
    import SettingsGeneral from './SettingsGeneral.svelte'
    import SettingsHome from './SettingsHome.svelte'
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    <form>
        <SettingsGeneral />
        <SettingsHome />
    </form>
</div>
