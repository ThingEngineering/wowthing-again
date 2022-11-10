<script lang="ts">
    import { staticStore, userStore } from '@/stores'
</script>

<style lang="scss">
    td {
        @include cell-width(2.0rem, $maxWidth: 5.0rem);
    }
</style>

{#each $userStore.data.homeLockouts as {difficulty, instanceId}}
    {@const instance = $staticStore.data.instances[instanceId]}
    <td>
        {difficulty ? difficulty.shortName + '-' : ''}{instance.shortName}
    </td>
{/each}
