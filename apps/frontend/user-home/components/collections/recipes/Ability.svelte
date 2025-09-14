<script lang="ts">
    import { Faction } from '@/enums/faction';
    import { uiIcons } from '@/shared/icons';
    import { userState } from '@/user-home/state/user';
    import type { StaticDataProfessionAbility } from '@/shared/stores/static/types';

    import { recipesState } from './state';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    type Props = {
        ability: StaticDataProfessionAbility;
        rank: number;
    };
    let { ability, rank }: Props = $props();

    let spellId = $derived(userState.recipes.abilitySpells[ability.id][rank - 1]);
    let userHas = $derived(userState.recipes.hasAbility[ability.id][rank - 1]);
    let name = $derived(ability.name || `{item:${ability.itemIds[0]}}` || `Spell #${spellId}`);
</script>

<style lang="scss">
    .faded td {
        opacity: 0.6;
    }
    .status {
        width: 22px;

        :global(svg) {
            margin-left: -2px;
        }
    }
    .name {
        --image-border-width: 1px;
        --padding-left: 0;
        --padding-right: 0;
        --width: 20rem;

        .flex-wrapper {
            max-width: 20rem;
            min-width: 20rem;

            :global(> a) {
                display: block;
                flex-grow: 1;
                min-width: 0;
            }
        }
    }
    .rank {
        --scale: 0.8;

        flex-shrink: 0;

        :global(svg:not(:first-child)) {
            margin-left: -6px;
        }
        :global(.faded) {
            opacity: 0.6;
        }
    }
</style>

{#if (userHas && $recipesState.showCollected) || (!userHas && $recipesState.showUncollected)}
    <tr
        class:faded={(userHas && $recipesState.highlightMissing) ||
            (!userHas && !$recipesState.highlightMissing)}
    >
        <td class="status">
            <YesNoIcon state={userHas} useStatusColors={true} />
        </td>
        <td class="name text-overflow">
            <div class="flex-wrapper">
                <WowheadLink id={spellId} type="spell">
                    <WowthingImage
                        name={ability.itemIds[0] > 0
                            ? `item/${ability.itemIds[0]}`
                            : `spell/${spellId}`}
                        size={20}
                        border={1}
                    />

                    {#if ability.faction === Faction.Alliance || ability.faction === Faction.Horde}
                        <FactionIcon faction={ability.faction} />
                    {/if}

                    <ParsedText text={name} />
                </WowheadLink>

                {#if ability.extraRanks?.length > 0}
                    <div class="rank">
                        {#each { length: ability.extraRanks.length + 1 }, index}
                            <IconifyIcon
                                extraClass={rank <= index ? 'faded' : undefined}
                                icon={rank > index ? uiIcons.starFull : uiIcons.starEmpty}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        </td>
    </tr>
{/if}
