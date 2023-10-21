<script lang="ts">
    import orderBy from 'lodash/orderBy'

    import { iconStrings, imageStrings } from '@/data/icons'
    import { professionIdToString } from '@/data/professions'
    import { staticStore } from '@/shared/stores/static'
    import { getNameForFaction } from '@/utils/get-name-for-faction'
    import { getProfessionEquipment, getProfessionSortKey } from '@/utils/professions'
    import type { Character, CharacterGear } from '@/types'
    import type { StaticDataProfession } from '@/shared/stores/static/types'

    import Empty from './ItemsEmpty.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import Item from './ItemsItem.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'
    
    export let character: Character
    
    let professions: [Partial<StaticDataProfession>, boolean, Partial<CharacterGear>[]][]
    $: {
        professions = []
        let type0s = 0
        for (const profession of Object.values($staticStore.professions)) {
            if (profession.slug === 'archaeology') {
                continue
            }

            const charProfession = character.professions?.[profession.id]
            if (!charProfession && profession.slug !== 'cooking' && profession.slug !== 'fishing') {
                continue
            }

            const equipment = getProfessionEquipment(character, profession.id)
            for (let i = 0; i < 3; i++) {
                equipment[i] ||= undefined
            }

            professions.push([
                profession,
                !!charProfession,
                orderBy(
                    Object.entries(equipment),
                    ([slot,]) => slot
                )
                .map(([, equipped]) => ({
                    equipped,
                }))
            ])

            if (profession.type === 0) {
                type0s++
            }
        }

        for (let i = type0s; i < 2; i++) {
            professions.push([
                {
                    type: 0,
                    name: 'ZZZ',
                },
                false,
                [null, null, null],
            ])
        }

        professions.sort((a, b) => getProfessionSortKey(a[0]).localeCompare(getProfessionSortKey(b[0])))
    }
</script>

<style lang="scss">
    .profession-icon {
        --image-border-width: 2px;

        border-left: 1px solid $border-color;
        padding: 0 0.4rem;
    }
    .no-profession {
        --scale: 1.3;

        color: $colour-fail;
    }
</style>

{#each professions as [profession, userHas, slots]}
    <td class="spacer"></td>
    
    <td
        class="profession-icon"
        class:no-profession={!userHas}
    >
        {#if userHas}
            <WowthingImage
                name="{imageStrings[professionIdToString[profession.id]]}"
                size={24}
                border={2}
                tooltip={getNameForFaction(profession.name, character.faction)}
            />
        {:else}
            <IconifyIcon
                icon={iconStrings.no}
                tooltip="No profession!"
            />
        {/if}
    </td>

    {#each Array(profession?.slug === 'fishing' ? 1 : (profession.type === 0 ? 3 : 2)) as _, slot}
        {@const gear = slots[slot]}
        {#if gear?.equipped}
            <Item
                forceCrafted={true}
                {gear}
            />
        {:else if !userHas}
            <Empty opacity="0.3" />
        {:else}
            <Empty
                text={slot === 0 ? 'Tool' : 'Acc'}
            />
        {/if}
    {/each}
{/each}
