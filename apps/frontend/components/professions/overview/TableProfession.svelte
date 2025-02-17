<script lang="ts">
    import type { Character, CharacterProfession } from '@/types'
    import getPercentClass from '@/utils/get-percent-class'

    export let character: Character
    export let primaryId: number
    export let subId: number

    let cls: string
    let profession: CharacterProfession
    $: {
        profession = character.professions?.[primaryId]?.[subId]
        cls = profession ? getPercentClass(profession.currentSkill / profession.maxSkill * 100) : 'status-fail'
    }
</script>

<style lang="scss">
    td {
        @include cell-width(4.5rem);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .flex-wrapper {
        justify-content: space-around;
    }
    .slash {
        color: #aaa;
        width: 1.0rem;
    }
    .value {
        text-align: right;
        width: 1.8rem;
    }
</style>

<td class="{cls}">
    {#if profession}
        <div class="flex-wrapper">
            <span class="value">{profession.currentSkill}</span>
            <span class="slash">/</span>
            <span class="value">{profession.maxSkill}</span>
        </div>
    {:else}
        ---
    {/if}
</td>
