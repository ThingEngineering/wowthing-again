import sortBy from 'lodash/sortBy'

import { dungeonMap } from '@/data/dungeon'
import type { Character, TippyProps } from '@/types'
import getMythicPlusVaultItemLevel from './get-mythic-plus-vault-item-level'

export default function getMythicPlusVaultTooltip(
    character: Character,
): TippyProps {
    let tooltip = `
<div class="wowthing-tooltip">
    <h4>${character.name}</h4>
    <table class="vault-mythic-tooltip table-striped">
        <tbody>
`

    const runs = character.weekly?.vault.mythicPlusRuns ?? [[]]
    if (runs.length > 0) {
        const sortedRuns = sortBy(
            character.weekly?.vault.mythicPlusRuns,
            (r) => -r[1],
        )
        for (let i = 0; i < sortedRuns.length; i++) {
            const [dungeonId, level] = sortedRuns[i]
            const dungeon = dungeonMap[dungeonId]
            const itemLevel = getMythicPlusVaultItemLevel(level)

            let cls = ''
            if (i === 0 || i === 3 || i === 9) {
                cls = ' class="vault-reward"'
            }

            tooltip += `
                <tr${cls}>
                    <td class="key-level">${level}</td>
                    <td class="dungeon-name">${dungeon.name}</td>
                    <td class="item-level">${itemLevel}</td>
                </tr>
            `
        }
    } else {
        tooltip += '<tr><td colspan="3">Do some Mythic+ dungeons!</td></tr>'
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
