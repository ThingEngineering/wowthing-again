<script lang="ts">
    import { Constants } from '@/data/constants'
    import { rewardTypeIcons } from '@/data/icons'
    import { Faction } from '@/enums/faction'
    import { RewardType } from '@/enums/reward-type'
    import { itemStore, userStore, userTransmogStore } from '@/stores'
    import { staticStore } from '@/stores/static'
    import type { Character } from '@/types'
    import type { StaticDataReputationReputation, StaticDataReputationSet } from '@/stores/static/types'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let faction: Faction = Faction.Neutral
    export let reputation: StaticDataReputationReputation
    export let set: StaticDataReputationSet

    let rewards: {
        id: number,
        name: string,
        type: RewardType,
        have: boolean,
    }[]
    let totalParagon = 0
    $: {
        rewards = []
        if (set.paragon) {
            totalParagon = $userStore.characters
                .reduce(
                    (a: number, b: Character) => a + (b.paragons?.[reputation.id]?.received ?? 0),
                    0
                )

            if (reputation.rewards) {
                for (const reward of reputation.rewards) {
                    let have = false
                    let name: string
                    if (reward.type === RewardType.Mount) {
                        have = $userStore.hasMount[reward.id] === true
                        const mount = $staticStore.mounts[reward.id]
                        name = mount ? mount.name : `Mount #${reward.id}`
                    }
                    else if (reward.type === RewardType.Pet) {
                        have = $userStore.hasPet[reward.id] === true
                        const pet = $staticStore.pets[reward.id]
                        name = pet ? pet.name : `Pet #${reward.id}`
                    }
                    else if (reward.type === RewardType.Toy) {
                        have = $userStore.hasToy[reward.id] === true
                        const toy = $staticStore.toys[reward.id]
                        name = toy ? toy.name : `Toy #${reward.id}`
                    }
                    else if (reward.type === RewardType.Transmog) {
                        const item = $itemStore.items[reward.id]
                        have = $userTransmogStore.hasAppearance.has(item?.appearances[0]?.appearanceId || 0)
                        name = item?.name || `Item #${reward.id}`
                    }

                    rewards.push({
                        ...reward,
                        have,
                        name,
                    })
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
                    <WowthingImage
                        name={Constants.icons.alliance}
                        size={20}
                    />
                {:else if faction === Faction.Horde}
                    <WowthingImage
                        name={Constants.icons.horde}
                        size={20}
                    />
                {/if}
                {$staticStore.reputations[reputation.id].name}
            </td>
        </tr>

        {#each rewards as reward}
            <tr
                class:have={reward.have}
            >
                <td
                    class="type status-{reward.have ? 'success' : 'fail'}"
                >
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
