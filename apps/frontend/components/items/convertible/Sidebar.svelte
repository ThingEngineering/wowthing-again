<script lang="ts">
    import { convertibleCategories } from './data'
    import { classOrder } from '@/data/character-class'
    import { Gender } from '@/enums/gender'
    import { staticStore } from '@/shared/stores/static'
    import { getGenderedName } from '@/utils/get-gendered-name'

    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    const children = classOrder.map((classId) => {
        const data = { ...$staticStore.characterClasses[classId] }
        data.name = `:class-${classId}: ${getGenderedName(data.name, Gender.Male)}`
        return data
    })
    const categories = convertibleCategories.map((cc) => ({ ...cc, children }))
</script>

<SubSidebar
    baseUrl={'/items/convertible'}
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width={'11rem'}
/>
