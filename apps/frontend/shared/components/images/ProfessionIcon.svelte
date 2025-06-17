<script lang="ts">
    import { imageStrings } from '@/data/icons';
    import { professionIdToSlug } from '@/data/professions';
    import { wowthingData } from '@/shared/stores/data';

    import WowthingImage from './sources/WowthingImage.svelte';

    let { id, border = 0, size = 20 }: { id: number; border?: number; size?: number } = $props();
</script>

<WowthingImage
    name={imageStrings[professionIdToSlug[id]]}
    tooltip={wowthingData.static.professionById.get(id).name.split('|')[0]}
    {size}
    {border}
/>
