<script lang="ts">
    import { convertibleCategories } from './data'
    import { classOrder } from '@/data/character-class'
    import { Gender } from '@/enums/gender'
    import { staticStore } from '@/shared/stores/static'
    import { getGenderedName } from '@/utils/get-gendered-name'

    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import { lazyStore } from '@/stores';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import { AppearanceModifier } from '@/enums/appearance-modifier';

    const children = [
        ...classOrder.map((classId) => {
            const data = { ...$staticStore.characterClasses[classId] }
            data.name = `:class-${classId}: ${getGenderedName(data.name, Gender.Male)}`
            return data
        }),
        null,
        {
            id: AppearanceModifier.Mythic,
            name: 'Mythic',
            slug: 'mythic',
        },
        {
            id: AppearanceModifier.Heroic,
            name: 'Heroic',
            slug: 'heroic',
        },
        {
            id: AppearanceModifier.Normal,
            name: 'Normal',
            slug: 'normal',
        },
        {
            id: AppearanceModifier.LookingForRaid,
            name: 'Looking For Raid',
            slug: 'looking-for-raid',
        },
    ]
    const categories = convertibleCategories.map((cc) => ({ ...cc, children }))

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        const seasonId = parentEntries[0]?.id || entry.id

        if (parentEntries.length > 0) {
            if (entry.name.includes(':class')) {
                return $lazyStore.convertible.stats[`${seasonId}--c${entry.id}`].percent
            }
            else {
                return $lazyStore.convertible.stats[`${seasonId}--m${entry.id}`].percent
            }
        }
        else {
            return $lazyStore.convertible.stats[`${seasonId}`].percent
        }
    }
</script>

<SubSidebar
    baseUrl={'/items/convertible'}
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width={'15rem'}
    {percentFunc}
/>
