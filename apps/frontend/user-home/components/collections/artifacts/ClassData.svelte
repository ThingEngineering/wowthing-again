<script lang="ts">
    import { PlayableClass } from '@/enums/playable-class';
    import { wowthingData } from '@/shared/stores/data';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import SpecializationData from './SpecializationData.svelte';

    type Props = {
        classId: PlayableClass;
        itemIds: number[];
    };
    let { classId, itemIds }: Props = $props();

    let cls = $derived(wowthingData.static.characterClassById.get(classId));
    let name = $derived(getGenderedName(cls.name));
</script>

<style lang="scss">
    .flex-wrapper {
        gap: 1rem;
        justify-content: flex-start;
    }
    .class-name {
        flex-shrink: 0;
        width: 9rem;
    }
</style>

<div class="flex-wrapper">
    <!-- <div class="class-name class-{classId}">
        {name}
    </div> -->
    {#each cls.specializationIds as specializationId, index (specializationId)}
        <SpecializationData artifactItemId={itemIds[index]} {classId} {specializationId} />
    {/each}
</div>
