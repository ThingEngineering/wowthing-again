<script lang="ts">
    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import { wowthingData } from '@/shared/stores/data';

    let sidebarItems = $derived(
        wowthingData.static.decorCategories.filter(
            (cat) => cat.subCategories.reduce((a, b) => a + b.objects.length, 0) > 0
        )
    );
</script>

<SubSidebar baseUrl="/collections/decor" items={sidebarItems} width="10rem" scrollable={false} />
