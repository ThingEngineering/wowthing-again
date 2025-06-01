<script lang="ts">
    import groupBy from 'lodash/groupBy';

    import { getGenderedName } from '@/utils/get-gendered-name';
    import { professionCooldowns, professionWorkOrders } from '@/data/professions/cooldowns';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import ProfessionIcon from '@/shared/components/images/ProfessionIcon.svelte';

    export let sortedProfessions: StaticDataProfession[];

    const groupedCooldowns = groupBy(
        [...professionWorkOrders, ...professionCooldowns],
        (cd) => cd.profession,
    );
</script>

<style lang="scss">
    h4 {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding-bottom: 0.2rem;

        + .many-boxes {
            border-top: 1px dotted $border-color;
        }
    }
    .many-boxes {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        display: flex;
        flex-wrap: wrap;
        gap: 0 1rem;

        :global(fieldset) {
            min-width: 0;
            white-space: nowrap;
            width: 14rem;
        }
    }
</style>

<div class="settings-block">
    <h3>Cooldowns</h3>

    {#each sortedProfessions as profession}
        {#if groupedCooldowns[profession.id]}
            <h4>
                <ProfessionIcon id={profession.id} border={1} size={16} />
                {getGenderedName(profession.name)}
            </h4>
            <div class="many-boxes">
                {#each groupedCooldowns[profession.id] as cooldown}
                    <CheckboxInput
                        name="professions_{cooldown.key}"
                        bind:value={settingsState.value.professions.cooldowns[cooldown.key]}
                    >
                        <ParsedText text={cooldown.name} />
                    </CheckboxInput>
                {/each}
            </div>
        {/if}
    {/each}
</div>
