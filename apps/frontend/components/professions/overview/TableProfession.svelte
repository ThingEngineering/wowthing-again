<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & {
        primaryId: number;
        subId: number;
    };
    let { character, primaryId, subId }: Props = $props();

    let profession = $derived(character.professions?.[primaryId]?.subProfessions?.[subId]);
    let cls = $derived(
        profession
            ? getPercentClass((profession.skillCurrent / profession.skillMax) * 100)
            : 'status-fail'
    );
    // }
</script>

<style lang="scss">
    td {
        --padding: 0.2rem;
        --width: 5.2rem;

        border-left: 1px solid var(--border-color);
        text-align: center;
    }
    .flex-wrapper {
        justify-content: center;
    }
    .slash {
        color: #aaa;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
    }
    .value {
        width: 1.8rem;

        &:first-child {
            text-align: right;
        }
        &:last-child {
            text-align: left;
        }
    }
</style>

<td class={cls}>
    {#if profession}
        <div class="flex-wrapper">
            <span class="value">{profession.skillCurrent}</span>
            <span class="slash">/</span>
            <span class="value">{profession.skillMax}</span>
        </div>
    {:else}
        ---
    {/if}
</td>
