<script lang="ts">
    import orderBy from 'lodash/orderBy';

    import { imageStrings } from '@/data/icons';
    import { uiIcons } from '@/shared/icons';
    import { professionIdToSlug } from '@/data/professions';
    import { staticStore } from '@/shared/stores/static';
    import { getNameForFaction } from '@/utils/get-name-for-faction';
    import { getProfessionEquipment, getProfessionSortKey } from '@/utils/professions';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { CharacterGear } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import CurrenciesCell from '@/user-home/components/currencies/TableRow.svelte';
    import Empty from '../../items/ItemsEmpty.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Item from '../../items/ItemsItem.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { someProfessions } from './some';

    let { character, professionId, slug }: CharacterProps & { professionId: number; slug: string } =
        $props();

    let professions = $derived.by(() => {
        const ret: [Partial<StaticDataProfession>, boolean, Partial<CharacterGear>[]][] = [];
        let type0s = 0;
        for (const profession of Object.values($staticStore.professions)) {
            if (professionId > 0 && profession.id !== professionId) {
                continue;
            }
            if (profession.slug === 'archaeology') {
                continue;
            }

            if (slug === 'some' && !someProfessions.includes(profession.id)) {
                continue;
            }

            const charProfession = character.professions?.[profession.id];
            if (
                slug !== 'some' &&
                !charProfession &&
                profession.slug !== 'cooking' &&
                profession.slug !== 'fishing'
            ) {
                continue;
            }

            const equipment = getProfessionEquipment(character, profession.id);
            for (let i = 0; i < 3; i++) {
                equipment[i] ||= undefined;
            }

            ret.push([
                profession,
                !!charProfession,
                orderBy(Object.entries(equipment), ([slot]) => slot).map(([, equipped]) => ({
                    equipped,
                })),
            ]);

            if (profession.type === 0) {
                type0s++;
            }
        }

        if (professionId === 0) {
            for (let i = type0s; i < 2; i++) {
                ret.push([
                    {
                        type: 0,
                        name: 'ZZZ',
                    },
                    false,
                    [null, null, null],
                ]);
            }
        }

        ret.sort((a, b) => getProfessionSortKey(a[0]).localeCompare(getProfessionSortKey(b[0])));
        return ret;
    });
</script>

<style lang="scss">
    .profession-icon {
        --image-border-width: 2px;

        border-left: 1px solid $border-color;
        padding: 0 0.1rem;
    }
    .icon-wrapper {
        --image-margin-top: 0;

        align-items: center;
        display: flex;
        justify-content: center;
        height: 42px;
        width: 42px;
    }
    .no-profession {
        --scale: 1.5;

        color: $color-fail;
    }
</style>

<td class="spacer"></td>
<CurrenciesCell {character} itemId={210814} sortingBy={false} />

{#each professions as [profession, userHas, slots] (profession)}
    <td class="spacer"></td>

    <td class="profession-icon" class:no-profession={!userHas}>
        <div class="icon-wrapper">
            {#if userHas}
                <WowthingImage
                    name={imageStrings[professionIdToSlug[profession.id]]}
                    size={32}
                    border={2}
                    tooltip={getNameForFaction(profession.name, character.faction)}
                />
            {:else}
                <IconifyIcon icon={uiIcons.no} tooltip="No profession!" />
            {/if}
        </div>
    </td>

    {#each { length: profession?.slug === 'fishing' ? 1 : profession.type === 0 ? 3 : 2 }, slot}
        {@const gear = slots[slot]}
        {#if gear?.equipped}
            <Item forceCrafted={true} {gear} />
        {:else if !userHas}
            <Empty opacity="0.3" />
        {:else}
            <Empty text={slot === 0 ? 'Tool' : 'Acc'} />
        {/if}
    {/each}
{/each}
