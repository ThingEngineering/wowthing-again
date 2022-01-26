<script lang="ts">
    import { Constants } from '@/data/constants'
    import { dropTypeStringIcon } from '@/data/farm'
    import { staticStore, userStore } from '@/stores'
    import { Faction } from '@/types/enums'
    import type { Character } from '@/types'
    import type { StaticDataReputationReputation, StaticDataReputationSet } from '@/types/data/static'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let faction: Faction = Faction.Neutral
    export let reputation: StaticDataReputationReputation
    export let set: StaticDataReputationSet

    const rewards: {
        id: number,
        name: string,
        type: string,
        have: boolean,
    }[] = []
    let totalParagon = 0
    $: {
        if (set.paragon) {
            totalParagon = $userStore.data.characters
                .reduce(
                    (a: number, b: Character) => a + (b.paragons?.[reputation.id]?.received ?? 0),
                    0
                )

            if (reputation.rewards) {
                for (const reward of reputation.rewards) {
                    let have = false
                    if (reward.type === 'mount') {
                        have = $userStore.data.hasMountSpell[reward.id] === true
                    }
                    else if (reward.type === 'pet') {
                        have = $userStore.data.hasPetCreature[reward.id] === true
                    }
                    else if (reward.type === 'toy') {
                        have = $userStore.data.hasToy[reward.id] === true
                    }

                    rewards.push({
                        ...reward,
                        have,
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
                {$staticStore.data.reputations[reputation.id].name}
            </td>
        </tr>

        {#each rewards as reward}
            <tr
                class:have={reward.have}
            >
                <td
                    class="type status-{reward.have ? 'success' : 'fail'}"
                >
                    <IconifyIcon icon={dropTypeStringIcon[reward.type]} />
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
