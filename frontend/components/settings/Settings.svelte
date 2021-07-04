<script lang="ts">
    import SettingsGeneral from './SettingsGeneral.svelte'
    import SettingsHome from './SettingsHome.svelte'
    import SettingsPrivacy from './SettingsPrivacy.svelte'
    import SettingsSave from './SettingsSave.svelte'
</script>

<style lang="scss">
    form {
        width: 100%;
    }
</style>

<form>
    <SettingsSave />
    <SettingsGeneral />
    <SettingsHome />
    <SettingsPrivacy />
</form>
