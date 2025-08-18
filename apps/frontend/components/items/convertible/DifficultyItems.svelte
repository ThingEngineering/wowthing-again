<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { LazyConvertibleModifier } from '@/user-home/state/lazy/convertible.svelte';

    import type { ConvertibleCategory } from './types';

    import DifficultyTable from './DifficultyTable.svelte';

    const modifierLookup = ['normal', 'heroic', null, 'mythic', 'looking-for-raid'];

    type Props = {
        difficultySlug: string;
        season: ConvertibleCategory;
    };

    let { difficultySlug, season }: Props = $props();

    let modifier = $derived(modifierLookup.indexOf(difficultySlug));

    // let classData: Record<number, Record<number, LazyConvertibleModifier>>;
    const classData = $derived.by(() => {
        const ret: Record<number, Record<number, LazyConvertibleModifier>> = {};
        for (const [classId, slots] of getNumberKeyedEntries(
            lazyState.convertible.seasons[season.id]
        )) {
            ret[classId] = {};

            for (const [slotId, slotData] of getNumberKeyedEntries(slots)) {
                ret[classId][slotId] = slotData.modifiers[modifier];
            }
        }
        return ret;
    });
</script>

<DifficultyTable {classData} {modifier} {season} />
