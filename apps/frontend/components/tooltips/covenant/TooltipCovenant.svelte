<script lang="ts">
    import { DateTime } from 'luxon'

    import { covenantMap, covenantOrder } from '@/data/covenant'
    import { timeStore } from '@/shared/stores/time'
    import { toNiceDuration, toNiceNumber } from '@/utils/formatting'
    import type { Character, CharacterShadowlandsCovenant, CharacterShadowlandsCovenantFeature } from '@/types'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let characterCovenantId: number
    let characterCovenants: Record<number, CharacterShadowlandsCovenant>
    $: {
        characterCovenantId = character.shadowlands?.covenantId || 0
        characterCovenants = character.shadowlands?.covenants || {}
    }

    const featureFunc = function(feature: CharacterShadowlandsCovenantFeature): number|string {
        if (!feature) {
            return '---'
        }

        if (feature.researchEnds > 0) {
            const ends: DateTime = DateTime.fromSeconds(feature.researchEnds)
            if (ends <= $timeStore) {
                return feature.rank + 1
            }
            else {
                const duration = toNiceDuration(ends.diff($timeStore).toMillis())
                return `${feature.rank + 1} in<br><span class="status-shrug">${duration}</span>`
            }
        }

        return feature.rank
    }

    const rows: [string, (c: CharacterShadowlandsCovenant) => number|string][] = [
        ['Renown', (c: CharacterShadowlandsCovenant) => c.renown],
        ['Anima', (c) => toNiceNumber(c.anima)],
        ['Souls', (c) => toNiceNumber(c.souls)],
        ['Conductor', (c) => featureFunc(c.conductor)],
        ['Missions', (c) => featureFunc(c.missions)],
        ['Transport', (c) => featureFunc(c.transport)],
        ['Unique', (c) => featureFunc(c.unique)],
    ]
</script>

<style lang="scss">
    thead {
        tr {
            th {
                border-bottom: 1px solid $border-color;
            }
        }
    }
    .name {
        padding-right: 1rem;
        text-align: left;
    }
    .value {
        border-left: 1px solid $border-color;
        width: 4rem;
    }
    .active {
        background: rgba(0, 0, 255, 0.3);
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name} - Covenants</h4>
    <table class="table-tooltip-lockout table-striped">
        <thead>
            <tr>
                <th></th>
                {#each covenantOrder as covenantId}
                    <th>
                        <WowthingImage
                            name={covenantMap[covenantId].icon}
                            size={32}
                            border={1}
                        />
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each rows as [name, valueFunc]}
                <tr>
                    <td class="name">{name}</td>
                    {#each covenantOrder as covenantId}
                        <td
                            class="value"
                            class:active={covenantId === characterCovenantId}
                        >
                            {#if characterCovenants[covenantId]}
                                {@html valueFunc(characterCovenants[covenantId])}
                            {:else}
                                ---
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
