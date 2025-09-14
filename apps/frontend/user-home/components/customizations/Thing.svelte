<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { userState } from '@/user-home/state/user';
    import type { ManualDataCustomizationThing } from '@/types/data/manual';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    let { thing }: { thing: ManualDataCustomizationThing } = $props();

    let have = $derived(
        (thing.achievementId > 0 &&
            userState.achievements.achievementEarnedById.has(thing.achievementId)) ||
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
    let nameParts = $derived((thing.name || '').split(' > '));
</script>

<style lang="scss">
    .yes-no {
        --width: 1rem;
    }
    .name {
        --width: 15rem;

        white-space: nowrap;
    }
    .item {
        --width: 20rem;

        white-space: nowrap;
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
            <ParsedText text={nameParts.length === 2 ? nameParts[1] : thing.name} />
        </td>
        <td class="item text-overflow">
            {#if thing.itemId > 0}
                <WowheadLink id={thing.itemId} type="item">
                    <ParsedText text={`{item:${thing.itemId}}`} />
                </WowheadLink>
            {:else}
                <WowheadLink id={thing.spellId} type="spell">
                    {nameParts.length === 2 ? nameParts[0] : thing.name}
                </WowheadLink>
            {/if}
        </td>
    </tr>
{/if}
