import sortBy from 'lodash/sortBy'

import getItemLevelQuality from './get-item-level-quality'
import getRealmName from './get-realm-name'
import {dungeonMap} from '@/data/dungeon'
import {specializationMap} from '@/data/specialization'
import {data as sData} from '@/stores/static-store'
import type {CharacterMythicPlusRun, StaticData} from '@/types'


let staticData: StaticData
sData.subscribe(value => {
    staticData = value
})

export default function getMythicPlusRunTooltip(runs: CharacterMythicPlusRun[]): object {
    let tooltip = `
<div class="wowthing-tooltip">
    <h4>${dungeonMap[runs[0].dungeonId].Name}</h4>
`

    for (let i = 0; i < runs.length; i++) {
        const run = runs[i]

        let affixes = ''
        for (let j = 0; j < run.affixes.length; j++) {
            affixes += `<img src="https://img.wowthing.org/20/affix_${run.affixes[j]}.png" width="22" height="22">`
        }

        tooltip += `
    <table class="mythic-plus-tooltip table-striped">
        <thead>
            <tr>
                <th colspan="3">${affixes} ${run.keystoneLevel}</th>
                <th>${run.completed.split('T')[0]}</th>
            </tr>
        </thead>
        <tbody>
`

        const members = sortBy(run.members, (m) => [specializationMap[m.specializationId].Role, m.name])
        for (let j = 0; j < members.length; j++) {
            const member = members[j]
            const spec = specializationMap[member.specializationId]
            const cls = staticData.Classes[spec.ClassId]

            tooltip += `
            <tr>
                <td>
                    <img src="https://img.wowthing.org/20/${cls.Icon}.png" width="22" height="22"><img src="https://img.wowthing.org/20/${spec.Icon}.png" width="22" height="22">
                </td>
                <td class="quality${getItemLevelQuality(member.itemLevel)}">${member.itemLevel}</td>
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
