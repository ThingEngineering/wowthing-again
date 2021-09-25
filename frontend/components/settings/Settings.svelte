<script lang="ts">
    import { afterUpdate } from 'svelte'
    import { replace } from 'svelte-spa-router'

    import { userStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './SettingsSidebar.svelte'
    import View from './SettingsView.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('settings', params.slug))

    $: {
        if ($userStore.data.public) {
            replace('/')
        }
    }
</script>

<style lang="scss">

</style>

<Sidebar />
<View slug={params.slug} />
