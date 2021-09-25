<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './SettingsSidebar.svelte'
    import View from './SettingsView.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('settings', params.slug))
</script>

<style lang="scss">

</style>

<Sidebar />
<View slug={params.slug} />
