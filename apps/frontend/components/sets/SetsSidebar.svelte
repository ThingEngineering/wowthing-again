<script lang="ts">
    import { lazyStore, manualStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'
    import Settings from '@/components/common/SidebarCollectingSettings.svelte'

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = $manualStore.transmog.sets.map((set) => set === null ? null : ({
            children: set.slice(1),
            ...set[0],
        }))

        overall = $lazyStore.transmog.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        return $lazyStore.transmog.stats[slug].percent
    }
</script>

<!-- svelte-ignore missing-declaration -->
<style lang="scss">
    div {
        margin-bottom: 0.75rem;

        :global(fieldset) {
            margin-top: 0.5rem;
        }
    }
</style>

<Sidebar
    baseUrl="/sets"
    items={categories}
    scrollable={true}
    width="16rem"
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={overall.have}
            total={overall.total}
        />

        <Settings />
    </div>
</Sidebar>
