<script lang="ts">
    import { userAchievementStore, userQuestStore, userStore } from '@/stores';
    import { collectibleState } from '@/stores/local-storage';
    import type { ManualDataCustomizationThing } from '@/types/data/manual';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';
    import WorldQuest from '../world-quests/WorldQuest.svelte';

    export let thing: ManualDataCustomizationThing;

    $: have =
        (thing.achievementId > 0 && !!$userAchievementStore.achievements[thing.achievementId]) ||
        (thing.questId > 0 && $userQuestStore.accountHas.has(thing.questId)) ||
        (thing.spellId > 0 &&
            $userStore.characters.some((char) => char.knownSpells?.includes(thing.spellId))) ||
        (thing.appearanceModifier >= 0 &&
            $userStore.hasSourceV2.get(thing.appearanceModifier).has(thing.itemId));
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

{#if (have && $collectibleState.showCollected['customizations']) || (!have && $collectibleState.showUncollected['customizations'])}
    <tr class:faded={$collectibleState.highlightMissing['customizations'] ? have : !have}>
        <td class="yes-no">
            <YesNoIcon state={have} useStatusColors={true} />
        </td>
        <td class="name text-overflow">
            <ParsedText text={thing.name} />
        </td>
        <td class="item text-overflow">
            {#if thing.itemId > 0}
                <WowheadLink id={thing.itemId} type={'item'}>
                    <ParsedText text={`{item:${thing.itemId}}`} />
                </WowheadLink>
            {:else}
                <WowheadLink id={thing.spellId} type={'spell'}>
                    {thing.name}
                </WowheadLink>
            {/if}
        </td>
    </tr>
{/if}
