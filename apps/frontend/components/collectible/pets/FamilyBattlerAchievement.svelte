<script lang="ts">
    import { criteriaIdToWorldQuestId } from '@/data/battle-pets';
    import { battlePetOrder, BattlePetType } from '@/enums/battle-pet-type';
    import { timeState } from '@/shared/state/time.svelte';
    import { dynamicDataStore } from '@/user-home/stores/dynamicData.svelte';
    import { userState } from '@/user-home/state/user';
    import type { FamilyBattlerData } from './generate-family-battler-data';

    import BattlePetTypeIcon from '@/shared/components/icons/BattlePetTypeIcon.svelte';
    import CollectibleCount from '../CollectibleCount.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    let { familyBattleData }: { familyBattleData: FamilyBattlerData } = $props();

    let allWorldQuests = $derived(
        dynamicDataStore
            .getCachedQuests(userState.general.allRegions[0])
            .filter((worldQuest) => worldQuest.expires > timeState.time)
            .map((worldQuest) => worldQuest.questId)
    );
    $inspect(allWorldQuests);
</script>

<style lang="scss">
    .name {
        --width: 20rem;

        max-width: var(--width);
    }
    .icon {
        --image-margin-top: -2px;
        --width: 4rem;

        border-left: 1px solid var(--border-color);
        text-align: center;
    }
    .blank {
        background: var(--color-body-background);
    }
    th.blank {
        border-right-width: 0 !important;
        border-top-width: 0 !important;
    }
    td.blank {
        border-bottom-width: 0 !important;

        &:first-child {
            border-left-width: 0 !important;
        }
        &:last-child {
            border-right-width: 0 !important;
        }
    }
</style>

<table class="table table-striped">
    <thead>
        <tr>
            <th>
                <WowheadLink type="achievement" id={familyBattleData.familyBattle.achievementId}
                    >{familyBattleData.name}
                </WowheadLink>
            </th>
            {#each battlePetOrder as battlePetType (battlePetType)}
                <th class="icon">
                    <BattlePetTypeIcon size={40} {battlePetType} />
                </th>
            {/each}
            <th class="blank b-l"></th>
        </tr>
    </thead>
    <tbody>
        {#each familyBattleData.rows as row (row.name)}
            {@const questId = criteriaIdToWorldQuestId[row.criteriaId]}
            <tr
                class:faded={!!questId && !allWorldQuests.includes(questId)}
                data-criteria-id={row.criteriaId}
            >
                <td class="name text-overflow">{row.name}</td>
                {#each row.userHas as userHas, columnIndex}
                    <td
                        class="icon"
                        data-tooltip="{row.name} - {BattlePetType[battlePetOrder[columnIndex]]}"
                    >
                        <YesNoIcon state={userHas} useStatusColors={true} />
                    </td>
                {/each}
                <td class="icon">
                    <CollectibleCount counts={row.stats} />
                </td>
            </tr>
        {/each}
    </tbody>
    <tfoot>
        <tr>
            <td class="blank"></td>
            {#each familyBattleData.columns as column}
                <td class="icon">
                    <CollectibleCount counts={column} />
                </td>
            {/each}
            <td class="blank b-l"></td>
        </tr>
    </tfoot>
</table>
