<script lang="ts">
    import repeat from 'lodash/repeat'
    import sortBy from 'lodash/sortBy'

    import {dungeonMap} from '@/data/dungeon'
    import type {CharacterMythicPlusRun, CharacterMythicPlusRunMember, Dungeon, DungeonTimedResult} from '@/types'

    import Member from './Member.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import {specializationMap} from '../../data/character-specialization'

    export let run: CharacterMythicPlusRun

    let completed: string
    let members: CharacterMythicPlusRunMember[]
    let result: DungeonTimedResult
    $: {
        const dungeon: Dungeon = dungeonMap[run.dungeonId]
        result = dungeon.getTimed(run.duration)

        completed = run.completed.split('T')[0]

        members = sortBy(run.members, (m) => [
            specializationMap[m.specializationId].role,
            m.name,
        ])
    }
</script>

<table class="tooltip-mythic-plus-runs table-striped">
    <thead>
        <tr>
            <th colspan="2">
                {run.keystoneLevel}
                <span>{repeat('+', result.plus)}</span>
            </th>
            <th>
                {#each run.affixes as affixId}
                    <WowthingImage name="affix_{affixId}" size={20} border={1} />
                {/each}
            </th>
            <th>{completed}</th>
        </tr>
    </thead>
    <tbody>
        {#each members as member}
            <Member {member} />
        {/each}
    </tbody>
</table>
