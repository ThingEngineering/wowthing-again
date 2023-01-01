<script lang="ts">
    import orderBy from 'lodash/orderBy'

    import { imageStrings } from '@/data/icons'
    import { professionIdToString } from '@/data/professions'
    import { staticStore } from '@/stores/static'
    import { getNameForFaction } from '@/utils/get-name-for-faction'
    import { getProfessionEquipment } from '@/utils/professions'
    import type { Character, CharacterGear } from '@/types'
    import type { StaticDataProfession } from '@/types/data/static';

    import Empty from './GearEmpty.svelte'
    import Item from './GearItem.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    
    export let character: Character
    
    let professions: [Partial<StaticDataProfession>, Partial<CharacterGear>[]][]
    $: {
        professions = []
        let type0s = 0
        for (const profession of Object.values($staticStore.data.professions)) {
            if (profession.slug === 'archaeology') {
                continue
            }

            const charProfession = character.professions?.[profession.id]
            if (!charProfession && profession.slug !== 'cooking' && profession.slug !== 'fishing') {
                continue
            }

            const equipment = getProfessionEquipment(character, profession.id)
            for (let i = 0; i < 3; i++) {
                if (!equipment[i]) {
                    equipment[i] = undefined
                }
            }

            professions.push([
                profession,
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
                [null, null, null],
            ])
        }

        professions.sort((a, b) => `${a[0].type}|${a[0].name}`.localeCompare(`${b[0].type}|${b[0].name}`))
    }
</script>

<style lang="scss">
    .profession-icon {
        --image-border-width: 2px;

        border-left: 1px solid $border-color;
        padding: 0 0.4rem;
    }
</style>

{#each professions as [profession, slots]}
    <td class="spacer"></td>
    
    {#if profession.name !== 'ZZZ'}
        <td class="profession-icon">
            <WowthingImage
                name="{imageStrings[professionIdToString[profession.id]]}"
                size={24}
                border={2}
                tooltip={getNameForFaction(profession.name, character.faction)}
            />
        </td>
    {/if}

    {#each Array(profession?.slug === 'fishing' ? 1 : (profession.type === 0 ? 3 : 2)) as _, slot}
        {@const gear = slots[slot]}
        {#if gear?.equipped}
            <Item {gear} />
        {:else}
            <Empty text={slot === 0 ? 'Tool' : 'Acc'} />
        {/if}
    {/each}
{/each}
