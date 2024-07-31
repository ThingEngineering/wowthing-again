<script lang="ts">
    import { ascensionFightOrder, ascensionFights, ascensionItems } from '@/data/covenant'
    import { uiIcons } from '@/shared/icons'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import { userQuestStore } from '@/stores'
    import type { Character, CharacterShadowlandsCovenantFeature } from '@/types'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let feature: CharacterShadowlandsCovenantFeature

    $: quests = $userQuestStore.characters[character.id]?.quests
</script>

<style lang="scss">
    .collection {
        border-width: 0;
        margin: 0 -0.25rem;
    }
    .collection-section {
        margin-bottom: -0.25rem;
        padding-bottom: 0;
        padding-left: 0.25rem;
    }
    .collection-objects {
        --image-border-width: 2px;

        div + div {
            margin-left: 0.2rem;
        }
    }
    .fight-table {
        margin-top: 1rem;

        td {
            padding-bottom: 0.3rem;
            padding-top: 0.3rem;

            :global(.unavailable) {
                color: #555;
            }
        }
    }
    .name {
        @include cell-width(9rem);
    }
    .progress {
        padding-left: 2px;
        padding-right: 2px;
    }
</style>

<div class="collection thing-container">
    <div class="collection-section">
        <div class="collection-objects">
            {#each ascensionItems as [itemId, questId]}
                {@const characterHas = $userQuestStore.characters[character.id]?.quests?.has(questId)}
                <div
                    class="quality3"
                    class:missing={!characterHas}
                >
                    <WowheadLink
                        type="item"
                        id={itemId}
                    >
                        <WowthingImage
                            name="item/{itemId}"
                            size={48}
                            border={2}
                        />
                    </WowheadLink>
                </div>
            {/each}
        </div>
    </div>
</div>

<table class="fight-table table table-striped">
    <thead>
        <tr>
            <th></th>
            <th class="border-left" use:basicTooltip={ascensionFightOrder[0]}>C</th>
            <th use:basicTooltip={ascensionFightOrder[1]}>L</th>
            <th use:basicTooltip={ascensionFightOrder[2]}>W</th>
            <th class="border-left" use:basicTooltip={ascensionFightOrder[3]}>P</th>
            <th use:basicTooltip={ascensionFightOrder[4]}>K</th>
            <th use:basicTooltip={ascensionFightOrder[5]}>M</th>
            <th use:basicTooltip={ascensionFightOrder[6]}>H</th>
        </tr>
    </thead>
    <tbody>
        {#each ascensionFights as fight}
            <tr>
                <td
                    class="name text-overflow"
                    use:basicTooltip={fight.name}
                >
                    {fight.name}
                </td>
                {#each fight.fightQuestIds as questId, questIndex}
                    {@const characterHas = quests?.has(questId)}
                    <td
                        class="progress"
                        class:border-left={questIndex === 0 || questIndex === 3}
                        class:status-success={characterHas}
                        class:status-fail={!characterHas}
                        use:basicTooltip={`${fight.name} - ${ascensionFightOrder[questIndex]}`}
                    >
                        {#if characterHas}
                            <IconifyIcon
                                icon={uiIcons.starFull}
                            />
                        {:else if feature?.rank < fight.unlockRanks[questIndex]}
                            <IconifyIcon
                                icon={uiIcons.lock}
                                extraClass="unavailable"
                            />
                        {:else if (
                            (questIndex > 0 && !quests?.has(fight.fightQuestIds[Math.min(2, questIndex-1)])) ||
                            (!quests?.has(fight.unlockQuestId))
                        )}
                            <IconifyIcon
                                icon={uiIcons.lock}
                            />
                        {:else}
                            <IconifyIcon
                                extraClass="status-shrug"
                                icon={uiIcons.starEmpty}
                            />
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
