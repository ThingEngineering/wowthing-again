<script lang="ts">
    import Fa from 'svelte-fa'

    import { farmType } from '@/data/farm'
    import type {FarmDataFarm} from '@/types/data'

    export let farm: FarmDataFarm

    console.log(farm)
</script>

<style lang="scss">
    .type {
        width: 2rem;
    }
    .name {
        text-align: left;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{farm.name}</h4>
    <h5>{farm.reset} reset</h5>
    <table class="table-tooltip-farm table-striped">
        <tbody>
            {#each farm.drops as drop}
                <tr>
                    <td class="type">
                        <Fa fw icon={farmType[drop.type]} />
                    </td>
                    <td class="name">{drop.name}</td>
                    <td>{drop.limit}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
