<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './ProfessionsRecipesSidebar.svelte'

    export let params: MultiSlugParams

    // blah blah load view based on params
    // - show every recipe for profession/expansion combo as a row,
    //   characters as columns?
</script>

<style lang="scss">
</style>

<Sidebar />
