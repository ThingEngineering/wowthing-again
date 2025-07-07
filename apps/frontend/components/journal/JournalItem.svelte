<script lang="ts">
    import { getDifficulties } from './get-difficulties';
    import { hardModeItemIds } from '@/data/journal';
    import { BindType } from '@/enums/bind-type';
    import { Faction } from '@/enums/faction';
    import { PlayableClass, PlayableClassMask } from '@/enums/playable-class';
    import { RewardType } from '@/enums/reward-type';
    import { iconLibrary } from '@/shared/icons';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { getItemUrl } from '@/utils/get-item-url';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';
    import type {
        JournalDataEncounterItem,
        JournalDataEncounterItemAppearance,
        JournalDataInstance,
    } from '@/types/data/journal';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        bonusIds?: Record<number, number>;
        instance: JournalDataInstance;
        item: JournalDataEncounterItem;
    };

    let { bonusIds, instance, item }: Props = $props();

    let classId = $derived(
        item.classMask in PlayableClassMask
            ? PlayableClass[PlayableClassMask[item.classMask] as keyof typeof PlayableClass]
            : 0
    );
    let dataItem = $derived(wowthingData.items.items[item.id]);

    const getQuality = function (appearance: JournalDataEncounterItemAppearance): number {
        // Mythic Keystone/Mythic difficulties should probably set the quality to epic?
        for (const difficulty of appearance.difficulties) {
            if (difficulty === 23) {
                return 4;
            }
        }
        return item.quality;
    };

    const getBonusIds = function (appearance: JournalDataEncounterItemAppearance): number[] {
        if (bonusIds === undefined || appearance.difficulties?.length > 1) {
            return [];
        }

        const bonusId = bonusIds[appearance.difficulties[0]];
        return bonusId ? [bonusId] : [];
    };
</script>

<style lang="scss">
    .journal-item {
        min-height: 52px;
        width: 52px;

        :global(a > img) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
    .overlay {
        --shadow-color: rgba(0, 0, 0, 0.5);

        border: none;
        pointer-events: none;
        position: absolute;
    }
    .player-class {
        --image-margin-top: -4px;

        height: 24px;
        left: 0;
        top: -2px;
        width: 24px;
    }
    .player-faction {
        height: 24px;
        left: 0;
        top: 26px;
        width: 24px;
    }
    .hard-mode {
        color: #fff;
        height: 24px;
        right: 0;
        top: 26px;
        width: 24px;
    }
    .collected-appearances {
        border-bottom-left-radius: 0;
        border-bottom-width: 0 !important;
        border-top-right-radius: 0;
        color: $color-success;
        font-size: 95%;
        line-height: 1;
        padding: 0.1rem 0.2rem;
        pointer-events: none;
        position: absolute;
        top: 31px;
        right: 1px;
    }
    .buyable {
        --scale: 0.9;
        background-color: $highlight-background;
        border: 2px solid;
        border-radius: var(--border-radius-small);
        color: $color-shrug;
        line-height: 1;
        position: absolute;
        right: -2px;
        top: -4px;
        transform: scale(0.7);
    }
    .difficulties {
        background-color: $highlight-background;
        border: 1px solid;
        border-radius: var(--border-radius-small);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        line-height: 1;
        margin-top: -1px;
        padding: 0 2px 1px 2px;
        text-align: center;
        white-space: nowrap;
    }
</style>

{#each item.appearances as appearance (appearance)}
    {#if (browserState.current.journal.showCollected && appearance.userHas) || (browserState.current.journal.showUncollected && !appearance.userHas)}
        {@const [diffShort, diffLong] = getDifficulties(instance, appearance)}
        <div
            class="journal-item quality{getQuality(appearance)}"
            class:missing={(!browserState.current.journal.highlightMissing &&
                !appearance.userHas) ||
                (browserState.current.journal.highlightMissing && appearance.userHas)}
        >
            <a
                href={getItemUrl({
                    itemId: item.id,
                    bonusIds: getBonusIds(appearance),
                })}
            >
                <WowthingImage
                    name="item/{item.id}{appearance.modifierId > 0
                        ? `_${appearance.modifierId}`
                        : ''}"
                    size={48}
                    border={2}
                />
            </a>

            {#if classId > 0}
                {@const hasSoon =
                    !appearance.userHas &&
                    userState.general.hasAppearanceBySource.has(
                        item.id * 1000 + appearance.modifierId
                    )}
                <div class="overlay player-class class-{classId} drop-shadow">
                    <ClassIcon border={2} size={20} {classId} />
                </div>

                {#if hasSoon}
                    <CollectedIcon soon={true} />
                {/if}
            {:else if item.type === RewardType.Recipe}
                {@const ability = wowthingData.static.professionAbilityByItemId.get(item.id)}
                {#if ability}
                    <div class="overlay player-class drop-shadow">
                        <ProfessionIcon border={2} size={20} id={ability.professionId} />
                    </div>
                {/if}
            {/if}

            {#if item.extraAppearances > 0}
                <div class="collected-appearances background-box drop-shadow-single">
                    +{item.extraAppearances}
                </div>
            {/if}

            {#if [BindType.NotBound, BindType.OnEquip].includes(dataItem.bindType)}
                <div class="overlay buyable drop-shadow" class:status-success={appearance.userHas}>
                    <IconifyIcon icon={iconLibrary.mdiBank} />
                </div>
            {:else if appearance.userHas}
                <CollectedIcon />
            {/if}

            {#if dataItem.allianceOnly || dataItem.hordeOnly}
                <div class="overlay player-faction drop-shadow">
                    <FactionIcon
                        faction={dataItem.allianceOnly ? Faction.Alliance : Faction.Horde}
                    />
                </div>
            {/if}

            {#if hardModeItemIds.has(dataItem.id)}
                <div class="overlay hard-mode drop-shadow">
                    <IconifyIcon icon={iconLibrary.mdiSkull} />
                </div>
            {/if}

            <div class="difficulties" use:basicTooltip={diffLong.join(' / ')}>
                {#each diffShort as difficulty}
                    <span>{difficulty}</span>
                {/each}
            </div>
        </div>
    {/if}
{/each}
