<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import getPercentClass from '@/utils/get-percent-class';
    import type { RewardType } from '@/enums/reward-type';

    type Props = {
        key: string;
        type: RewardType;
    };
    let { key, type }: Props = $props();

    let counts = $derived(lazyState.zoneMaps.typeCounts[key]?.[type]);
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

{#if counts?.total > 0}
    <div class={getPercentClass((counts.have / counts.total) * 100)}>
        {counts.have} / {counts.total}
    </div>
{/if}
