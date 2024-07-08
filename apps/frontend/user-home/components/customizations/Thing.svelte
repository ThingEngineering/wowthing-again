<script lang="ts">
    import { userAchievementStore, userQuestStore, userStore } from '@/stores'
    import { collectibleState } from '@/stores/local-storage'
    import type { ManualDataCustomizationThing } from '@/types/data/manual';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'

    export let thing: ManualDataCustomizationThing

    $: have = (
        (thing.achievementId > 0 && !!$userAchievementStore.achievements[thing.achievementId]) ||
        (thing.questId > 0 && $userQuestStore.accountHas.has(thing.questId)) ||
        (thing.appearanceModifier >= 0 && $userStore.hasSource.has(`${thing.itemId}_${thing.appearanceModifier}`))
    )
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

{#if (have && $collectibleState.showCollected['customizations'])
    || (!have && $collectibleState.showUncollected['customizations'])}
    <tr
        class:faded={$collectibleState.highlightMissing['customizations'] ? have : !have}
    >
        <td class="yes-no">
            <YesNoIcon
                state={have}
                useStatusColors={true}
            />
        </td>
        <td class="name text-overflow">
            <ParsedText text={thing.name} />
        </td>
        <td class="item text-overflow">
            <WowheadLink
                id={thing.itemId}
                type={'item'}
            >
                <ParsedText text={`{item:${thing.itemId}}`} />
            </WowheadLink>
        </td>
    </tr>
{/if}
