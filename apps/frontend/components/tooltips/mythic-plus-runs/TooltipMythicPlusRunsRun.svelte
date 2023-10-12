<script lang="ts">
    import repeat from 'lodash/repeat'
    import sortBy from 'lodash/sortBy'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'
    import { dungeonMap } from '@/data/dungeon'
    import { staticStore } from '@/shared/stores/static'
    import type {
        CharacterMythicPlusRun,
        CharacterMythicPlusRunMember,
        Dungeon,
        DungeonTimedResult
    } from '@/types'

    import Member from './TooltipMythicPlusRunsMember.svelte'

    export let run: CharacterMythicPlusRun

    let completed: string
    let members: CharacterMythicPlusRunMember[]
    let result: DungeonTimedResult
    $: {
        const dungeon: Dungeon = dungeonMap[run.dungeonId]
        result = dungeon.getTimed(run.duration)

        completed = run.completed.split('T')[0]

        members = sortBy(run.memberObjects, (m: CharacterMythicPlusRunMember) => [
            //specializationMap[m.specializationId].role,
            $staticStore.characterSpecializations[m.specializationId].role,
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
            <th class="affixes">
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
