<script lang="ts">
    import find from 'lodash/find'
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import { Region } from '@/enums/region'
    import { staticStore } from '@/shared/stores/static'
    import { userStore } from '@/stores'
    import { settingsStore } from '@/user-home/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import { splitOnce } from '@/utils/split-once'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { Character } from '@/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    let decorationFunc: (entry: SidebarItem, parentEntries?: SidebarItem[]) => string
    $: {
        const realmCharacters: Record<string, Character[]> = groupBy(
            $userStore.characters.filter(
                (char) => $settingsStore.characters.hiddenCharacters.indexOf(char.id) === -1 &&
                    $settingsStore.characters.ignoredCharacters.indexOf(char.id) === -1
            ),
            (char) => char.realmId
        )

        categories = []
        const sortFunc = getCharacterSortFunc($settingsStore, $staticStore)
        for (const realmId in realmCharacters)
        {
            const realm = $staticStore.realms[parseInt(realmId)]
            const characters = sortBy(
                realmCharacters[realmId],
                (character) => sortFunc(character)
            )

            categories.push({
                name: `[${Region[realm.region]}] ${realm.name}`,
                slug: `${Region[realm.region].toLowerCase()}-${realm.slug}`,
                children: characters.map((character) => ({
                   name: `:class-${character.classId}: ${character.name}`,
                   slug: character.name,
                }))
            })
        }

        categories = sortBy(categories, (category) => [
            100 - category.children.length, category.name
        ].join('|'))

        decorationFunc = (entry: SidebarItem, parentEntries?: SidebarItem[]) => {
            if (parentEntries?.length < 1) {
                return entry.children.length.toString()
            }
            else {
                const [region, realm] = splitOnce(parentEntries.slice(-1)[0].slug, '-')
                const character = find(
                    $userStore.characters,
                    (character: Character) => (
                        Region[character.realm.region].toLowerCase() === region &&
                        character.realm.slug === realm &&
                        character.name === entry.name.split(' ')[1]
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
    scrollable={true}
    {decorationFunc}
/>
