<script lang="ts">
    import { staticStore } from '@/stores/static'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'
    import { SidebarItem } from '../../types'

    let categories: SidebarItem[] = []
    $: {
        categories = $staticStore.data.progress.map((set) => set === null ? null : ({
            children: [],
            ...set[0],
        }))
    }
</script>

<Sidebar
    baseUrl="/progress"
    items={categories}
    width="12rem"
/>
