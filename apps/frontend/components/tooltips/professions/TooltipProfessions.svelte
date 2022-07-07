<script lang="ts">
    import getPercentClass from '@/utils/get-percent-class'
    import type { Character } from '@/types'
    import type { StaticDataProfession} from '@/types/data/static'

    export let character: Character
    export let profession: StaticDataProfession

    let name: string
    let subProfessions: [string, number, number][]
    $: {
        const names = profession.name.split('|')
        name = names[character.faction] || names[0]

        subProfessions = []
        for (const subProfession of profession.subProfessions) {
            const subNames = subProfession.name.split('|')
            subProfessions.push([
                subNames[character.faction] || subNames[0],
                character.professions?.[profession.id][subProfession.id]?.currentSkill ?? 0,
                character.professions?.[profession.id][subProfession.id]?.maxSkill ?? 0,
            ])
        }
    }
</script>

<style lang="scss">
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
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - {name}</h4>
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
</div>
