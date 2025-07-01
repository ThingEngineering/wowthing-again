<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type { RewardType } from '@/enums/reward-type';
    import type { UserCount } from '@/types';

    export let key: string;
    export let type: RewardType;

    let counts: UserCount;
    $: {
        counts = lazyState.zoneMaps.typeCounts[key]?.[type];
    }
</script>

<style lang="scss">
    div {
        background: $highlight-background;
        border: 1px solid var(--border-color);
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        border-top-width: 0;
        //font-size: 90%;
        line-height: 1;
        margin: 2.5px -3px 0 2.5px;
        padding: 0 0.3rem 0.2rem 0.3rem;
        word-spacing: -0.2ch;
        z-index: 10;
    }
</style>

{#if counts && counts.total > 0}
    <div class={getPercentClass((counts.have / counts.total) * 100)}>
        {counts.have} / {counts.total}
    </div>
{/if}
