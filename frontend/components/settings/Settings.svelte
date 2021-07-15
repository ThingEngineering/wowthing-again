<script lang="ts">
    import SettingsApiKey from './SettingsApiKey.svelte'
    import SettingsGeneral from './SettingsGeneral.svelte'
    import SettingsGroupBy from './SettingsGroupBy.svelte'
    import SettingsHome from './SettingsHome.svelte'
    import SettingsPrivacy from './SettingsPrivacy.svelte'
    import SettingsSave from './SettingsSave.svelte'
    import SettingsSortBy from './SettingsSortBy.svelte'
</script>

<style lang="scss">
    form {
        display: flex;
        width: 100%;
    }
    div {
        & + div {
            margin-left: 1rem;
        }
    }
</style>

<form>
    <div>
        <SettingsSave />
        <SettingsGeneral />
        <SettingsPrivacy />
        <SettingsApiKey />
    </div>
    <div>
        <SettingsHome />
        <SettingsGroupBy />
    </div>
    <div>
        <SettingsSortBy />
    </div>
</form>
