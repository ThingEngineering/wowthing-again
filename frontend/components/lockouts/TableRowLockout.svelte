<script lang="ts">
    import {data as staticData} from '@/stores/static'
    import type {Character, CharacterLockout, InstanceDifficulty, StaticDataInstance} from '@/types'

    export let character: Character
    export let instanceDifficulty: InstanceDifficulty

    let instance: StaticDataInstance
    let lockout: CharacterLockout

    $: {
        instance = $staticData.instances[instanceDifficulty.instanceId]
        lockout = character.lockouts?.[instanceDifficulty.key]
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-lockout, $paddingRight: $width-spacer);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if lockout}
    <td>
        <span>{lockout.defeatedBosses}</span>
        <span>/</span>
        <span>{lockout.maxBosses}</span>
    </td>
{:else}
    <td>&nbsp;</td>
{/if}
