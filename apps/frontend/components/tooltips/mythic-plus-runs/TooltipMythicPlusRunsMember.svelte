<script lang="ts">
    import {classMap} from '@/data/character-class'
    import {specializationMap} from '@/data/character-specialization'
    import type {CharacterClass, CharacterMythicPlusRunMember, CharacterSpecialization} from '@/types'
    import getItemLevelQuality from '@/utils/get-item-level-quality'
    import getRealmName from '@/utils/get-realm-name'

    import ClassIcon from '@/components/images/ClassIcon.svelte'
    import SpecializationIcon from '@/components/images/SpecializationIcon.svelte'

    export let member: CharacterMythicPlusRunMember

    let cls: CharacterClass
    let spec: CharacterSpecialization
    $: {
        spec = specializationMap[member.specializationId]
        cls = classMap[spec.classId]
    }
</script>

<tr>
    <td>
        <ClassIcon characterClass={cls} />
        <SpecializationIcon characterSpec={spec} />
    </td>
    <td class="quality{getItemLevelQuality(member.itemLevel)}">{member.itemLevel}</td>
    <td>{member.name}</td>
    <td>&ndash; {getRealmName(member.realmId)}</td>
</tr>
