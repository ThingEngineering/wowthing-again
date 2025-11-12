<script lang="ts">
    import { classOrder } from '@/data/character-class';
    import { artifactsByClass } from './data';
    import { PlayableClass } from '@/enums/playable-class';
    import ClassData from './ClassData.svelte';
</script>

<div class="view">
    <div class="wrapper-column">
        {#each classOrder.filter((c) => c !== PlayableClass.Evoker) as classId (classId)}
            <ClassData {classId} itemIds={artifactsByClass[classId]} />
        {/each}
    </div>
</div>
