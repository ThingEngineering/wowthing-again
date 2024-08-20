<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Categories from './VendorsCategories.svelte'
    import Sidebar from './VendorsSidebar.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => {
        getSavedRoute('vendors', params.slug1, params.slug2)
    })
</script>

<Sidebar />
<Categories {params} />
