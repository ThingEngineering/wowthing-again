<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToSlug } from '@/data/professions'
    import { settingsStore } from '@/shared/stores/settings';
    import getPercentClass from '@/utils/get-percent-class'
    import type { StaticDataProfession} from '@/shared/stores/static/types'
    import type { Character } from '@/types'
    
    import Equipment from '@/components/professions/Equipment.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let profession: StaticDataProfession

    let name: string
    let subProfessions: [string, number, number][]
    $: {
        const names = profession.name.split('|')
        name = names[character.faction] || names[0]

        subProfessions = []
        for (const expansion of settingsStore.expansions) {
            const subProfession = profession.expansionSubProfession[expansion.id];
            if (!subProfession) { continue; }
            
            const subNames = subProfession.name.split('|');
            
            subProfessions.push([
                subNames[character.faction] || subNames[0],
                character.professions?.[profession.id][subProfession.id]?.currentSkill ?? 0,
                character.professions?.[profession.id][subProfession.id]?.maxSkill ?? 0,
            ]);
        }
    }
</script>

<style lang="scss">
    h5 {
        --image-border-width: 2px;
    }
    .name {
        text-align: right;
    }
    .number {
        text-align: right;
    }
    .separator {
        padding: 0;
    }
    .status-fail {
        text-align: center;
    }
    .equipment {
        margin: 0.5rem 0;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>
        <WowthingImage
            name="{imageStrings[professionIdToSlug[profession.id]]}"
            size={20}
            border={1}
        />
        {name}
    </h5>

    <table class="table-striped">
        <tbody>
            {#each subProfessions as [name, current, max]}
                <tr>
                    <td class="name">{name}</td>
                    {#if max > 0}
                        <td class="number {getPercentClass(current / max * 100)}">{current}</td>
                        <td class="separator">/</td>
                        <td class="number {getPercentClass(current / max * 100)}">{max}</td>
                    {:else}
                        <td class="status-fail" colspan="3">--------</td>
                    {/if}
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="equipment">
        <Equipment
            {character}
            {profession}
        />
    </div>
</div>
