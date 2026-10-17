<script lang="ts">
    import { hiddenSkillLineAbilitySpellIds } from '@/data/professions/hidden';
    import { BindType } from '@/enums/bind-type';
    import { Faction } from '@/enums/faction';
    import { iconLibrary } from '@/shared/icons';
    import { wowthingData } from '@/shared/stores/data';
    import type {
        StaticDataProfession,
        StaticDataProfessionAbility,
        StaticDataSubProfession,
    } from '@/shared/stores/static/types';
    import type { Character } from '@/types/character';
    import type { Icon } from '@/types/icons';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    type Props = {
        ability: StaticDataProfessionAbility;
        characters: Character[];
        profession: StaticDataProfession;
        rank: number;
        subProfession: StaticDataSubProfession;
    };
    let { ability, characters, profession, rank, subProfession }: Props = $props();

    let [abilityId, spellId] = $derived(
        rank > 1 ? ability.extraRanks[rank - 2] : [ability.id, ability.spellId]
    );

    let recipes = $derived(wowthingData.static.skillLineAbilityItems[abilityId] || []);
    let recipeItem = $derived(wowthingData.items.items[recipes[0]]);
    let isHidden = $derived(hiddenSkillLineAbilitySpellIds.has(spellId));
    let isIgnored = $derived(wowthingData.manual.ignoredSkillLineAbilitySpellIds.has(spellId));
    let anyCharacterHas = $derived(characters.some((char) => char?.knownRecipes?.has(abilityId)));

    const rankIcons: Record<number, Icon> = {
        1: iconLibrary.mynauiNumber1Circle,
        2: iconLibrary.mynauiNumber2Circle,
        3: iconLibrary.mynauiNumber3Circle,
        4: iconLibrary.mynauiNumber4Circle,
    };
</script>

<style lang="scss">
    .status {
        border-left: 1px solid var(--border-color);
        text-align: center;
    }
</style>

{#if !isHidden && (!isIgnored || anyCharacterHas)}
    <tr data-id={ability.id}>
        <td class="source">
            {#if recipeItem}
                <span class="quality{recipeItem.quality ?? 1}">
                    <WowheadLink type="item" id={recipeItem.id}>
                        <WowthingImage name="item/{recipeItem.id}" size={20} border={1} />

                        {#if recipeItem.allianceOnly}
                            <FactionIcon faction={Faction.Alliance} />
                        {:else if recipeItem.hordeOnly}
                            <FactionIcon faction={Faction.Horde} />
                        {/if}
                    </WowheadLink>
                </span>
            {:else if spellId}
                <WowheadLink type="spell" id={spellId}>
                    <WowthingImage name="spell/{spellId}" size={20} border={1} />
                </WowheadLink>
            {:else}
                <ProfessionIcon id={profession.id} border={1} />
            {/if}
        </td>
        <td
            class="name text-overflow {ability.itemIds[0]
                ? `quality${wowthingData.items.items[ability.itemIds[0]].quality}`
                : undefined}"
        >
            <WowheadLink type="spell" id={spellId}>
                {#if ability.name}
                    {ability.name}
                {:else}
                    {wowthingData.items.items[ability.itemIds[0] || 0]?.name}
                {/if}

                {#if ability.extraRanks.length > 0}
                    <IconifyWrapper cls="quality1" icon={rankIcons[rank]} scale="1.1" />
                {/if}
            </WowheadLink>
        </td>
        <td class="auctions">
            {#if recipes && recipes.some((id) => wowthingData.items.items[id]?.bindType !== BindType.OnAcquire)}
                <a
                    href="#/auctions/specific-item/{recipes[0]}"
                    target="_blank"
                    data-tooltip="Find auctions"
                >
                    <IconifyWrapper cls="quality1" icon={iconLibrary.mdiBank} />
                </a>
            {/if}
        </td>

        {#each characters as character}
            {#if character === null}
                <td class="spacer"></td>
            {:else if (recipeItem?.allianceOnly && character.faction !== Faction.Alliance) || (recipeItem?.hordeOnly && character.faction !== Faction.Horde)}
                <td class="status faded">---</td>
            {:else}
                {@const charProf =
                    character.professions[profession.id]?.subProfessions?.[subProfession.id]}
                {@const charHas = charProf?.knownRecipes?.has?.(abilityId)}
                <td class="status" class:status-success={charHas} class:status-fail={!charHas}>
                    <YesNoIcon state={charHas} />
                </td>
            {/if}
        {/each}
    </tr>
{/if}
