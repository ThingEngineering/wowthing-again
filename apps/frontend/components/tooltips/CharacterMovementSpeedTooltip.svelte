<script lang="ts">
    import type { CharacterMovementSpeed } from '@/types/character/movement-speed';
    import type { CharacterProps } from '@/types/props';

    type Props = CharacterProps & { movementSpeed: CharacterMovementSpeed };
    let { character, movementSpeed }: Props = $props();
</script>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Movement Speed</h5>
    <table class="table-striped">
        <tbody>
            <tr>
                <td class="r">Enchants</td>
                <td class="r">
                    {#if movementSpeed.enchants > 0}
                        {movementSpeed.enchants.toFixed(1)}%
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="r">Gems</td>
                <td class="r">
                    {#if movementSpeed.gems > 0}
                        {movementSpeed.gems.toFixed(1)}%
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="r">Rating</td>
                <td class="r">
                    {#if movementSpeed.rating > 0}
                        {movementSpeed.rating.toFixed(1)}%
                    {/if}
                </td>
            </tr>
            <tr>
                <td class="r">Talents</td>
                <td class="r">
                    {#if movementSpeed.talents > 0}
                        {movementSpeed.talents.toFixed(1)}%
                    {/if}
                </td>
            </tr>
            {#if movementSpeed.shapeshift > 0}
                <tr>
                    <td class="r">Shapeshift</td>
                    <td class="r">
                        {movementSpeed.shapeshift.toFixed(1)}%
                    </td>
                </tr>
            {/if}
        </tbody>
    </table>
    <div class="bottom">
        Total +{movementSpeed.total}%
    </div>
</div>
