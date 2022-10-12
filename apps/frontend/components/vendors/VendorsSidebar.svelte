<script lang="ts">
    import { manualStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import { userVendorStore } from '@/stores/user-vendors'
    import type { SidebarItem, UserCount } from '@/types'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    let overall: UserCount
    $: {
        categories = $manualStore.data.vendors.sets.map((cat) => cat === null ? null : ({
            children: cat.slice(1),
            ...cat[0],
        }))

        overall = $userVendorStore.data.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $userVendorStore.data.stats[slug]
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
            bind:value={$settingsData.transmog.completionistMode}
        >Completionist Mode</Checkbox>
    </div>
</Sidebar>
