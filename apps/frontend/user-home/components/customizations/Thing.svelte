<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { userAchievementStore } from '@/stores';
    import { userState } from '@/user-home/state/user';
    import type { ManualDataCustomizationThing } from '@/types/data/manual';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    let { thing }: { thing: ManualDataCustomizationThing } = $props();

    let have = $derived(
        (thing.achievementId > 0 && !!$userAchievementStore.achievements[thing.achievementId]) ||
            (thing.questId > 0 && userState.quests.accountHasById.has(thing.questId)) ||
            (thing.spellId > 0 &&
                userState.general.activeCharacters.some((char) =>
                    char.knownSpells?.includes(thing.spellId)
                )) ||
            (thing.appearanceModifier >= 0 &&
                userState.general.hasAppearanceBySource.has(
                    thing.itemId * 1000 + thing.appearanceModifier
                ))
    );
    let show = $derived(
        (have && browserState.current['collectible-customizations'].showCollected) ||
            (!have && browserState.current['collectible-customizations'].showUncollected)
    );
</script>

<style lang="scss">
    .yes-no {
        @include cell-width(1rem, $paddingLeft: 0px, $paddingRight: 0.5rem);
    }
    .name {
        @include cell-width(15rem);

        white-space: nowrap;
    }
    .item {
        @include cell-width(20rem);

        white-space: nowrap;
    }
    .faded {
        opacity: 0.6;
    }
</style>

{#if show}
    <tr
        class:faded={browserState.current['collectible-customizations'].highlightMissing
            ? have
            : !have}
    >
        <td class="yes-no">
            <YesNoIcon state={have} useStatusColors={true} />
        </td>
        <td class="name text-overflow">
            <ParsedText text={thing.name} />
        </td>
        <td class="item text-overflow">
            {#if thing.itemId > 0}
                <WowheadLink id={thing.itemId} type="item">
                    <ParsedText text={`{item:${thing.itemId}}`} />
                </WowheadLink>
            {:else}
                <WowheadLink id={thing.spellId} type="spell">
                    {thing.name}
                </WowheadLink>
            {/if}
        </td>
    </tr>
{/if}
