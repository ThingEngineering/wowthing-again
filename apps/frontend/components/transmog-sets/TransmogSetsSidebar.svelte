<script lang="ts">
    import { manualStore, userTransmogStore } from '@/stores'
    import { settingsStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'

    import Checkbox from '@/shared/forms/CheckboxInput.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = $manualStore.transmog.setsV2.map((set) => set === null ? null : ({
            children: set.slice(1),
            ...set[0],
        }))

        overall = $userTransmogStore.statsV2['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $userTransmogStore.statsV2[slug]
        return hasData.have / hasData.total * 100
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
    baseUrl="/transmog-sets"
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
