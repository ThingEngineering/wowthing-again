<script lang="ts">
    import { lazyStore } from '@/stores'
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries'
    import type { LazyConvertibleModifier } from '@/stores/lazy/convertible'

    import { convertibleCategories } from './data'

    import DifficultyTable from './DifficultyTable.svelte'

    export let seasonSlug: string
    export let difficultySlug: string

    $: season = convertibleCategories.find((cc) => cc.slug === seasonSlug)
    $: modifier = ['normal', 'heroic', null, 'mythic', 'looking-for-raid'].indexOf(difficultySlug)
    
    let classData: Record<number, Record<number, LazyConvertibleModifier>>
    $: {
        classData = {}
        for (const [classId, slots] of getNumberKeyedEntries($lazyStore.convertible.seasons[season.id])) {
            classData[classId] = {}

            for (const [slotId, slotData] of getNumberKeyedEntries(slots)) {
                classData[classId][slotId] = slotData.modifiers[modifier]
            }
        }
        console.log(classData)
    }
</script>

<DifficultyTable
    {classData}
    {modifier}
/>
