<script lang="ts">
    import type { StaticDataProfessionAbility } from '@/shared/stores/static/types'

    export let ability: StaticDataProfessionAbility
    export let currentSkill: number

    $: useLow = ability.trivialLow &&
                ability.trivialLow < ability.trivialHigh &&
                ability.trivialLow > currentSkill
    $: mid = Math.floor((ability.trivialLow + ability.trivialHigh) / 2)
</script>

<style lang="scss">
    .flex-wrapper {
        justify-content: flex-end;
        padding-left: 0;
        text-align: right;

        span {
            white-space: nowrap;
            width: 2.2rem;
        }
    }
    .trivial-low {
        color: $colour-shrug;
    }
    .trivial-mid {
        color: $colour-success;
    }
    .trivial-high {
        color: #bbb;
    }
</style>

<div class="flex-wrapper">
    {#if useLow}
        <span class="trivial-low">{ability.trivialLow}</span>

        {#if mid > currentSkill}
            <span class="trivial-mid">{mid}</span>
        {/if}
    {/if}

    {#if ability.trivialHigh > 1}
        <span class="trivial-high">{ability.trivialHigh}</span>
    {/if}
</div>
