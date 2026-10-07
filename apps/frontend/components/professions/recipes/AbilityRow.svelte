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
        subProfession: StaticDataSubProfession;
    };
    let { ability, characters, profession, subProfession }: Props = $props();

    let recipes = $derived(wowthingData.static.skillLineAbilityItems[ability.id] || []);
    let recipeItem = $derived(wowthingData.items.items[recipes[0]]);
    let isHidden = $derived(hiddenSkillLineAbilitySpellIds.has(ability.spellId));
    let isIgnored = $derived(
        wowthingData.manual.ignoredSkillLineAbilitySpellIds.has(ability.spellId)
    );
    let anyCharacterHas = $derived(characters.some((char) => char?.knownRecipes?.has(ability.id)));
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
            {:else if ability.spellId}
                <WowheadLink type="spell" id={ability.spellId}>
                    <WowthingImage name="spell/{ability.spellId}" size={20} border={1} />
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
            <WowheadLink type="spell" id={ability.spellId}>
                {#if ability.name}
                    {ability.name}
                {:else}
                    {wowthingData.items.items[ability.itemIds[0] || 0]?.name}
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
                    <IconifyWrapper icon={iconLibrary.mdiBank} />
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
                {@const charHas = charProf?.knownRecipes?.has?.(ability.id)}
                <td class="status" class:status-success={charHas} class:status-fail={!charHas}>
                    <YesNoIcon state={charHas} />
                </td>
            {/if}
        {/each}
    </tr>
{/if}
