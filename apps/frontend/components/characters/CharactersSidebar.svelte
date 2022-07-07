<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import { staticStore, userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import { Region } from '@/types/enums'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import { splitOnce } from '@/utils/split-once'
    import type { Character, SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    let decorationFunc: (entry: SidebarItem, parentEntry?: SidebarItem) => string
    $: {
        const realmCharacters: Record<string, Character[]> = groupBy(
            filter(
                $userStore.data.characters,
                (char) => $settingsData.characters.hiddenCharacters.indexOf(char.id) === -1
            ),
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
                name: `[${Region[realm.region]}] ${realm.name}`,
                slug: `${Region[realm.region].toLowerCase()}-${realm.slug}`,
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
                const [region, realm] = splitOnce(parentEntry.slug, '-')
                const character = find(
                    $userStore.data.characters,
                    (character: Character) => (
                        Region[character.realm.region].toLowerCase() === region &&
                        character.realm.slug === realm &&
                        character.name === entry.name
                    )
                )
                return character?.level.toString() ?? '??'
            }
        }
    }
</script>

<style lang="scss">
</style>

<Sidebar
    baseUrl="/characters"
    items={categories}
    width="14rem"
    noVisitRoot={true}
    {decorationFunc}
/>
