<script lang="ts">
    import { staticStore } from '@/stores/static'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'
</script>

<Sidebar
    baseUrl="/progress"
    items={$staticStore.data.progress}
    width="14rem"
    linkColor="#64e1ff"
/>
