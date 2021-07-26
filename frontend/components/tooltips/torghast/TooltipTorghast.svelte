<script lang="ts">
    import type {Character} from '@/types'

    export let character: Character
    export let wings: [string, number][]
</script>

<div class="wowthing-tooltip">
    <h4>{character.name} - Torghast</h4>
    <table class="table-striped table-tooltip-torghast">
        <tbody>
            {#each wings as wing}
                <tr>
                    <td class="name">{wing[0]}</td>
                    <td class="level">{wing[1]}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
