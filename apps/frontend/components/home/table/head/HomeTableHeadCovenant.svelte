<script lang="ts">
    import { covenantMap, covenantOrder } from '@/data/covenant';
    import { settingsState } from '@/shared/state/settings.svelte';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
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

<td class={settingsState.value.layout.covenantColumn}>
    {#if settingsState.value.layout.covenantColumn === 'current'}
        Cov.
    {:else}
        <div class="flex-wrapper">
            {#each covenantOrder as covenantId (covenantId)}
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
