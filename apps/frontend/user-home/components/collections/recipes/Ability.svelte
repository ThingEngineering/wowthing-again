<script lang="ts">
    import { uiIcons } from '@/shared/icons';
    import { lazyStore } from '@/stores';
    import type { StaticDataProfessionAbility } from '@/shared/stores/static/types';

    import { recipesState } from './state'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'

    export let ability: StaticDataProfessionAbility
    export let rank: number

    $: name = ability.name || `{item:${ability.itemIds[0]}}` || `Spell #${spellId}`
    $: spellId = $lazyStore.recipes.abilitySpells[ability.id][rank - 1]
    $: userHas = $lazyStore.recipes.hasAbility[ability.id][rank - 1]
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

        @include cell-width(20rem, $paddingLeft: 0, $paddingRight: 0);

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

{#if (userHas && $recipesState.showCollected) ||
    (!userHas && $recipesState.showUncollected)}
    <tr class:faded={(userHas && $recipesState.highlightMissing) || (!userHas && !$recipesState.highlightMissing)}>
        <td class="status">
            <YesNoIcon
                state={userHas}
                useStatusColors={true}
            />
        </td>
        <td class="name text-overflow">
            <div class="flex-wrapper">
                <WowheadLink
                    id={spellId}
                    type={"spell"}
                >
                    <WowthingImage
                        name={ability.itemIds[0] > 0 ? `item/${ability.itemIds[0]}` : `spell/${spellId}`}
                        size={20}
                        border={1}
                    />

                    <ParsedText text={name} />
                </WowheadLink>

                {#if ability.extraRanks?.length > 0}
                    <div class="rank">
                        {#each Array(ability.extraRanks.length + 1) as _, index}
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
