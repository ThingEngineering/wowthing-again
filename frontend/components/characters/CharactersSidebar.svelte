<script lang="ts">
    import find from 'lodash/find'
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import { staticStore, userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { Character, SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    let decorationFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => string
    $: {
        const realmCharacters: Record<string, Character[]> = groupBy(
            $userStore.data.characters,
            (char) => char.realmId
        )

        categories = []
        const sortFunc = getCharacterSortFunc($settingsData)
        for (const realmId in realmCharacters)
        {
            const realm = $staticStore.data.realms[parseInt(realmId)]
            const characters = sortBy(
                realmCharacters[realmId],
                (character) => sortFunc(character)
            )

            categories.push({
                name: realm.name,
                slug: realm.slug,
                children: characters.map((character) => ({
                   name: character.name,
                   slug: character.name,
                }))
            })
        }

        categories = sortBy(categories, (category) => category.name)

        decorationFunc = (entry: SidebarItem, parentEntry?: SidebarItem) => {
            if (parentEntry === undefined) {
                return entry.children.length.toString()
            }
            else {
                return find(
                    $userStore.data.characters,
                    (character: Character) => (
                        character.realm.slug === parentEntry.slug &&
                        character.name === entry.name
                    )
                ).level.toString()
            }
        }
    }
</script>

<style lang="scss">
</style>

<Sidebar
    baseUrl="/characters"
    items={categories}
    width="12rem"
    noVisitRoot={true}
    {decorationFunc}
/>
