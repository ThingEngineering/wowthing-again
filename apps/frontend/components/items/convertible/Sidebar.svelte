<script lang="ts">
    import { convertibleCategories } from './data'
    import { classOrder } from '@/data/character-class'
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { Gender } from '@/enums/gender'
    import { staticStore } from '@/shared/stores/static'
    import { lazyStore } from '@/stores';
    import { getGenderedName } from '@/utils/get-gendered-name'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Settings from '@/components/common/SidebarCollectingSettings.svelte'
    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'
    import type { LazyConvertible } from '@/stores/lazy/convertible';

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

    // Svelte 4 workaround - it can't see the store access inside the function so pass it in
    const percentFunc = function(lazyConvertible: LazyConvertible, entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        const seasonId = parentEntries[0]?.id || entry.id

        if (parentEntries.length > 0) {
            if (entry.name.includes(':class')) {
                return lazyConvertible.stats[`${seasonId}--c${entry.id}`].percent
            }
            else {
                return lazyConvertible.stats[`${seasonId}--m${entry.id}`].percent
            }
        }
        else {
            return lazyConvertible.stats[`${seasonId}`].percent
        }
    }
</script>

<SubSidebar
    baseUrl="/items/convertible"
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="15rem"
    percentFunc={(entry, parentEntries) => percentFunc($lazyStore.convertible, entry, parentEntries)}
>
    <svelte:fragment slot="before">
        <Settings />
    </svelte:fragment>
</SubSidebar>
