<script lang="ts">
    import { Constants } from '@/data/constants';
    import { Faction } from '@/enums/faction';
    import { RewardType } from '@/enums/reward-type';
    import { rewardTypeIcons } from '@/shared/icons/mappings';
    import { wowthingData } from '@/shared/stores/data';
    import type { Character } from '@/types';
    import type {
        ManualDataReputationReputation,
        ManualDataReputationSet,
    } from '@/types/data/manual';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { userState } from '@/user-home/state/user';

    export let faction: Faction = Faction.Neutral;
    export let reputation: ManualDataReputationReputation;
    export let set: ManualDataReputationSet;

    let rewards: {
        id: number;
        name: string;
        type: RewardType;
        have: boolean;
    }[];
    let totalParagon = 0;
    $: {
        rewards = [];
        if (set.paragon) {
            totalParagon = userState.general.activeCharacters.reduce(
                (a: number, b: Character) => a + (b.paragons?.[reputation.id]?.received ?? 0),
                0
            );

            if (reputation.rewards) {
                for (const reward of reputation.rewards) {
                    let have = false;
                    let name: string;
                    if (reward.type === RewardType.Mount) {
                        have = userState.general.hasMountById.has(reward.id);
                        const mount = wowthingData.static.mountById.get(reward.id);
                        name = mount ? mount.name : `Mount #${reward.id}`;
                    } else if (reward.type === RewardType.Pet) {
                        have = userState.general.hasPetById.has(reward.id);
                        const pet = wowthingData.static.petById.get(reward.id);
                        name = pet ? pet.name : `Pet #${reward.id}`;
                    } else if (reward.type === RewardType.Toy) {
                        have = userState.general.hasToyById.has(reward.id);
                        const toy = wowthingData.static.toyById.get(reward.id);
                        name = toy ? toy.name : `Toy #${reward.id}`;
                    } else if (reward.type === RewardType.Transmog) {
                        const item = wowthingData.items.items[reward.id];
                        have = userState.general.hasAppearanceById.has(
                            item?.appearances[0]?.appearanceId || 0
                        );
                        name = item?.name || `Item #${reward.id}`;
                    }

                    rewards.push({
                        ...reward,
                        have,
                        name,
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    .faction {
        --image-margin-top: -4px;

        text-align: left;
        font-size: 1.1rem;
    }
    .have {
        opacity: 0.7;
    }
    .type {
        width: 1.6rem;
    }
    .name {
        padding-left: 0;
        text-align: left;
    }
</style>

<table class="table-striped">
    <tbody>
        <tr>
            <td class="faction" colspan="2">
                {#if faction === Faction.Alliance}
                    <WowthingImage name={Constants.icons.alliance} size={20} />
                {:else if faction === Faction.Horde}
                    <WowthingImage name={Constants.icons.horde} size={20} />
                {/if}
                {wowthingData.static.reputationById.get(reputation.id).name}
            </td>
        </tr>

        {#each rewards as reward}
            <tr class:have={reward.have}>
                <td class="type status-{reward.have ? 'success' : 'fail'}">
                    <IconifyIcon icon={rewardTypeIcons[reward.type]} />
                </td>
                <td class="name">
                    {reward.name}
                </td>
            </tr>
        {/each}

        {#if set.paragon}
            <tr>
                <td class="paragon" colspan="2">
                    <strong>{totalParagon}</strong> Paragon reward{totalParagon === 1 ? '' : 's'} received
                </td>
            </tr>
        {/if}
    </tbody>
</table>
