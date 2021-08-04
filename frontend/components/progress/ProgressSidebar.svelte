<script lang="ts">
    import { data as staticData } from '@/stores/static'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'
</script>

<Sidebar
    baseUrl="/progress"
    items={$staticData.progress}
    width="14rem"
    linkColor="#64e1ff"
/>
