<script lang="ts">
    import { timeStore } from '@/shared/stores/time'
    import { toNiceDuration } from '@/utils/formatting'
    import type { Character, ProfessionCooldown } from '@/types'

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte'

    export let character: Character
    export let cooldowns: ProfessionCooldown[]
</script>

<style lang="scss">
    table {
        width: auto;
    }
    td {
        white-space: nowrap;
    }
    .icon {
        --image-border-width: 1px;

        padding-right: 0;
        width: calc(21px + 0.4rem);
    }
    .name {
        padding-left: 0.2rem;
        text-align: left;
        width: 10rem;
    }
    .full {
        width: 4rem;
    }
    .value {
        text-align: right;
        max-width: 3rem;
        width: 1rem;
    }
    .slash {
        padding: 0;
        width: 0.5rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Profession Cooldowns</h5>
    <table class="table table-striped">
        <tbody>
            {#each cooldowns as cooldown}
                {@const per = cooldown.have / cooldown.max * 100}
                <tr>
                    <td class="icon">
                        <ProfessionIcon
                            id={cooldown.data.profession}
                            border={1}
                        />
                    </td>
                    <td class="name">
                        <ParsedText text={cooldown.data.name} />
                    </td>
                    <td class="full">
                        {#if cooldown.have === cooldown.max}
                            ----
                        {:else if cooldown.full}
                            {@html toNiceDuration(cooldown.full.diff($timeStore).toMillis())}
                        {:else}
                            ????
                        {/if}
                    </td>
                    <td
                        class="value"
                        class:status-fail={per === 100}
                        class:status-shrug={per >= 50 && per < 100}
                    >
                        {cooldown.have}
                    </td>
                    <td class="slash">/</td>
                    <td
                        class="value"
                        class:status-fail={per === 100}
                        class:status-shrug={per >= 50 && per < 100}
                    >
                        {cooldown.max}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
