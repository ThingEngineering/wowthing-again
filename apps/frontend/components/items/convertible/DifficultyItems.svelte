<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { LazyConvertibleModifier } from '@/user-home/state/lazy/convertible.svelte';

    import type { ConvertibleCategory } from './types';

    import DifficultyTable from './DifficultyTable.svelte';

    export let difficultySlug: string;
    export let season: ConvertibleCategory;

    $: modifier = ['normal', 'heroic', null, 'mythic', 'looking-for-raid'].indexOf(difficultySlug);

    let classData: Record<number, Record<number, LazyConvertibleModifier>>;
    $: {
        classData = {};
        for (const [classId, slots] of getNumberKeyedEntries(
            lazyState.convertible.seasons[season.id]
        )) {
            classData[classId] = {};

            for (const [slotId, slotData] of getNumberKeyedEntries(slots)) {
                classData[classId][slotId] = slotData.modifiers[modifier];
            }
        }
    }
</script>

<DifficultyTable {classData} {modifier} />
