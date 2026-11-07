<script lang="ts">
    import { battlePetOrder } from '@/enums/battle-pet-type';
    import type { FamilyBattlerData } from './family-battler-data';

    import BattlePetTypeIcon from '@/shared/components/icons/BattlePetTypeIcon.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    let { familyBattle }: { familyBattle: FamilyBattlerData } = $props();
</script>

<style lang="scss">
    .name {
        --width: 20rem;

        max-width: var(--width);
    }
    .icon {
        --image-margin-top: -2px;
        --width: 3rem;

        border-left: 1px solid var(--border-color);
        text-align: center;
    }
</style>

<table class="table table-striped">
    <thead>
        <tr>
            <th>{familyBattle.name}</th>
            {#each battlePetOrder as battlePetType (battlePetType)}
                <th class="icon">
                    <BattlePetTypeIcon size={40} {battlePetType} />
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each familyBattle.rows as row (row.name)}
            <tr>
                <td class="name text-overflow">{row.name}</td>
                {#each row.userHas as userHas}
                    <td class="icon">
                        <YesNoIcon state={userHas} useStatusColors={true} />
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
