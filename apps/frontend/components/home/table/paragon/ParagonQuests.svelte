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

        for (const reputation of paragonReputations) {
            const characterIds =
                userState.quests.progressQuestCharactersByKey[`q${reputation.paragonQuestId}`] ||
                [];
            if (characterIds.length > 0) {
                ret[reputation.id] = characterIds;
            }
        }

        return ret;
    });
    let total = $derived(Object.values(paragonQuests).reduce((a, b) => a + b.length, 0));
</script>

<style lang="scss">
    .paragons {
        --border-color: rgb(255, 119, 255);
    }
</style>

{#if total > 0}
    <div
        class="paragons"
        use:componentTooltip={{
            component: Tooltip,
            propsFunc: () => ({
                paragonQuests,
            }),
        }}
    >
        Paragons: {total}
    </div>
{/if}
