<script lang="ts">
    import find from 'lodash/find';
    import groupBy from 'lodash/groupBy';
    import sortBy from 'lodash/sortBy';

    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getCharacterSortFunc } from '@/utils/get-character-sort-func';
    import { splitOnce } from '@/utils/split-once';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { Character } from '@/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories = $derived.by(() => {
        const ret: SidebarItem[] = [];

        const realmCharacters: Record<string, Character[]> = groupBy(
            userState.general.activeCharacters,
            (char) => char.realmId
        );

        const sortFunc = getCharacterSortFunc();
        for (const realmId in realmCharacters) {
            const realm = wowthingData.static.realmById.get(parseInt(realmId));
            const characters = sortBy(realmCharacters[realmId], (character) => sortFunc(character));

            ret.push({
                name: `[${Region[realm.region]}] ${realm.name}`,
                slug: `${Region[realm.region].toLowerCase()}-${realm.slug}`,
                children: characters.map((character) => ({
                    name: `:class-${character.classId}: ${character.name}`,
                    slug: character.name,
                })),
            });
        }

        return sortBy(ret, (category) => [100 - category.children.length, category.name].join('|'));
    });

    let decorationFunc = $derived.by(() => (entry: SidebarItem, parentEntries?: SidebarItem[]) => {
        if (parentEntries?.length < 1) {
            return entry.children.length.toString();
        } else {
            const [region, realm] = splitOnce(parentEntries.slice(-1)[0].slug, '-');
            const character = find(
                userState.general.activeCharacters,
                (character: Character) =>
                    Region[character.realm.region].toLowerCase() === region &&
                    character.realm.slug === realm &&
                    character.name === entry.name.split(' ')[1]
            );
            return character?.level.toString() ?? '??';
        }
    });
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
