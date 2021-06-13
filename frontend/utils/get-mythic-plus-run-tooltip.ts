import repeat from 'lodash/repeat'
import sortBy from 'lodash/sortBy'

import getItemLevelQuality from './get-item-level-quality'
import getRealmName from './get-realm-name'
import { classMap } from '@/data/character-class'
import { specializationMap } from '@/data/character-specialization'
import { dungeonMap } from '@/data/dungeon'
//import {data as sData} from '@/stores/static'
import type {
    CharacterMythicPlusRun,
    TippyProps /*, StaticData*/,
} from '@/types'

/*let staticData: StaticData
sData.subscribe(value => {
    staticData = value
})*/

export default function getMythicPlusRunTooltip(
    runs: CharacterMythicPlusRun[],
): TippyProps {
    const dungeon = dungeonMap[runs[0].dungeonId]

    let tooltip = `
<div class="wowthing-tooltip">
    <h4>${dungeon.name}</h4>
`

    for (let i = 0; i < runs.length; i++) {
        const run = runs[i]
        const result = dungeon.getTimed(run.duration)

        let affixes = ''
        for (let j = 0; j < run.affixes.length; j++) {
            affixes += `<img src="https://img.wowthing.org/20/affix_${run.affixes[j]}.png" width="22" height="22">`
        }

        let level: string
        if (result.plus > 0) {
            level = `${run.keystoneLevel}<span>${repeat(
                '+',
                result.plus,
            )}</span>`
        } else {
            level = `${run.keystoneLevel}`
        }

        tooltip += `
    <table class="mythic-plus-tooltip table-striped">
        <thead>
            <tr>
                <th colspan="2">${level}</th>
                <th>${affixes}</th>
                <th>${run.completed.split('T')[0]}</th>
            </tr>
        </thead>
        <tbody>
`

        const members = sortBy(run.members, (m) => [
            specializationMap[m.specializationId].role,
            m.name,
        ])
        for (let j = 0; j < members.length; j++) {
            const member = members[j]
            const spec = specializationMap[member.specializationId]
            const cls = classMap[spec.classId]

            tooltip += `
            <tr>
                <td>
                    <img src="https://img.wowthing.org/20/${
                        cls.icon
                    }.png" width="22" height="22"><img src="https://img.wowthing.org/20/${
                spec.icon
            }.png" width="22" height="22">
                </td>
                <td class="quality${getItemLevelQuality(member.itemLevel)}">${
                member.itemLevel
            }</td>
                <td>${member.name}</td>
                <td>&ndash; ${getRealmName(member.realmId)}</td>
            </tr>
`
        }

        tooltip += `
        </tbody>
    </table>
`
    }

    tooltip += `
</div>
`

    return {
        allowHTML: true,
        content: tooltip,
    }
}
