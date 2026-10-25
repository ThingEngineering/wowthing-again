<script lang="ts">
    import type { ManualDataReputationSet } from '@/types/data/manual';

    import AccountWideReputation from './AccountWideReputation.svelte';

    type Props = {
        accountSets: [ManualDataReputationSet[], number][];
        hasCharacterSets: boolean;
        slug: string;
    };
    let { accountSets, hasCharacterSets, slug }: Props = $props();
</script>

<style lang="scss">
    .account-container {
        --image-border-width: 1px;

        columns: var(--columns);
        gap: 1rem;
    }
    .account-set + .account-set {
        margin-top: 1rem;
    }
</style>

<div class="account-container" style:--columns={hasCharacterSets ? '1' : '4'}>
    {#each accountSets as [reputationSets, reputationsIndex] (reputationSets)}
        <div class="account-set no-break">
            {#each reputationSets as reputationSet, reputationSetsIndex (reputationSet)}
                <AccountWideReputation
                    {reputationsIndex}
                    {reputationSet}
                    {reputationSetsIndex}
                    {slug}
                />
            {/each}
        </div>
    {/each}
</div>
