<script lang="ts">
    import type { MythicPlusAffix } from '@/types'

    import AffixIcon from '@/components/images/AffixIcon.svelte'

    export let affixes: MythicPlusAffix[]
</script>

<style lang="scss">
    th {
        @include cell-width($width-keystone);

        vertical-align: bottom;
    }
    .flex-wrapper {
        gap: 4px;
        justify-content: center;
    }
</style>

<th>
    {#if affixes}
        <div class="flex-wrapper">
            {#each affixes as affix}
                <AffixIcon {affix} />
            {/each}
        </div>
    {/if}
    Keystone
</th>
