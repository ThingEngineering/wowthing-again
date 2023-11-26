<script lang="ts">
    import { lazyStore, manualStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    export let basePath = ''

    let categories: SidebarItem[]
    $: {
        categories = $manualStore.customizationCategories
            .map((cat) => cat === null ? null : {
                name: cat[0].name,
                slug: cat[0].slug,
                children: cat.slice(1)
                    .map((subCat) => subCat === null ? null : {
                        name: subCat.name,
                        slug: subCat.slug,
                    })
            })
    }

    $: stats = $lazyStore.customizations.OVERALL

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        if (parentEntries?.length < 1 && entry.name === 'Expansion') {
            return -1
        }

        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $lazyStore.customizations[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl={basePath ? `/${basePath}/customizations` : '/customizations'}
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="18rem"
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={stats.have}
            total={stats.total}
        />
    </div>
</Sidebar>
