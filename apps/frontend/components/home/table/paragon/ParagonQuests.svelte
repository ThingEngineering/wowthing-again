<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userState } from '@/user-home/state/user';

    import Tooltip from './Tooltip.svelte';

    const paragonReputations = Array.from(wowthingData.static.reputationById.values()).filter(
        (rep) => rep.paragonQuestId > 0
    );

    let paragonQuests = $derived.by(() => {
        const ret: Record<number, number[]> = {};
        const allCharQuests = Array.from(userState.quests.characterById.values());

        for (const reputation of paragonReputations) {
            const questKey = `q${reputation.paragonQuestId}`;
            const characterIds = allCharQuests
                .filter((charQuests) => charQuests.progressQuestByKey.has(questKey))
                .map((charQuests) => charQuests.characterId);

            if (characterIds.length > 0) {
                ret[reputation.id] = characterIds;
            }
        }

        console.log(ret);
        return ret;
    });
    let total = $derived(Object.values(paragonQuests).reduce((a, b) => a + b.length, 0));
    $inspect(paragonQuests);
</script>

<style lang="scss">
    .paragons {
        border: 1px solid rgb(255, 119, 255);
        border-radius: $border-radius-large;
        margin-left: 0.5rem;
        padding: 0.1rem 0.5rem;
        z-index: 10;
    }
</style>

{#if total > 0}
    <div class="paragons" use:componentTooltip={{ component: Tooltip, props: { paragonQuests } }}>
        Available Paragons: {total}
    </div>
{/if}
