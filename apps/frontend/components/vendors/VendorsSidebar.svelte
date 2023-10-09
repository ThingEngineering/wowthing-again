<script lang="ts">
    import { manualStore } from '@/stores'
    import { lazyStore, settingsStore } from '@/stores'
    import type { SidebarItem } from '@/shared/sub-sidebar/types'
    import type { UserCount } from '@/types'

    import Checkbox from '@/shared/forms/CheckboxInput.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    let overall: UserCount
    $: {
        categories = $manualStore.vendors.sets.map((cat) => cat === null ? null : ({
            children: cat.slice(1),
            ...cat[0],
        }))

        overall = $lazyStore.vendors.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $lazyStore.vendors.stats[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;

        :global(fieldset) {
            margin-top: 0.5rem;
        }
    }
</style>

<Sidebar
    baseUrl="/vendors"
    items={categories}
    width="16rem"
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={overall.have}
            total={overall.total}
        />
        
        <Checkbox
            name="transmog_completionistMode"
            bind:value={$settingsStore.transmog.completionistMode}
        >Completionist Mode</Checkbox>
    </div>
</Sidebar>
