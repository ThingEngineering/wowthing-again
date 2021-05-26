import sortBy from 'lodash/sortBy'

import {dungeonMap, seasonMap} from '@/data/dungeon'
import type {Character} from '@/types'
import getMythicPlusVaultItemLevel from './get-mythic-plus-vault-item-level'


export default function getMythicPlusVaultTooltip(character: Character): object {
    let tooltip = `
<div class="wowthing-tooltip">
    <h4>${character.name}</h4>
    <table class="vault-mythic-tooltip table-striped">
        <tbody>
`

    const runs = sortBy(character.weekly.vault.mythicPlusRuns, (r) => -r[1])
    for (let i = 0; i < runs.length; i++) {
        const [dungeonId, level] = runs[i]
        const dungeon = dungeonMap[dungeonId]
        const itemLevel = getMythicPlusVaultItemLevel(level)

        let cls = ''
        if (i === 0 || i === 3 || i === 9) {
            cls = ' class="vault-reward"'
        }

        tooltip += `
            <tr${cls}>
                <td>${level}</td>
                <td>${dungeon.Name}</td>
                <td>${itemLevel}</td>
            </tr>
        `
    }

    tooltip += `
        </tbody>
    </table>
</div>
`

    return {
        allowHTML: true,
        content: tooltip,
        placement: 'right',
    }
}
