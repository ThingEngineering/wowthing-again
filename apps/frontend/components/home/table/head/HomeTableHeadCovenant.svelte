<script lang="ts">
    import { covenantMap, covenantOrder } from '@/data/covenant'
    import { settingsStore } from '@/stores'

    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'
</script>

<style lang="scss">
    td {
        padding-bottom: 2px;
        text-align: center;
        vertical-align: bottom;

        &.current {
            @include cell-width($width-covenant);
        }
        &.all {
            @include cell-width($width-covenant-all);
        }
    }
    .flex-wrapper {
        gap: 0.4rem;
        justify-content: center;
    }
</style>

<td class="{$settingsStore.layout.covenantColumn}">
    {#if $settingsStore.layout.covenantColumn === 'current'}
        Cov.
    {:else}
        <div class="flex-wrapper">
            {#each covenantOrder as covenantId}
                <WowthingImage
                    name={covenantMap[covenantId].icon}
                    size={20}
                    border={1}
                    tooltip={covenantMap[covenantId].name}
                />
            {/each}
        </div>
    {/if}
</td>
