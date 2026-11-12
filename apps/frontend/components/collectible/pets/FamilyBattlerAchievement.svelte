<script lang="ts">
    import { battlePetOrder, BattlePetType } from '@/enums/battle-pet-type';
    import type { FamilyBattlerData } from './family-battler-data';

    import BattlePetTypeIcon from '@/shared/components/icons/BattlePetTypeIcon.svelte';
    import CollectibleCount from '../CollectibleCount.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    let { familyBattleData }: { familyBattleData: FamilyBattlerData } = $props();
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
            <tr>
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
