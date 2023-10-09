<script lang="ts">
    import { staticStore } from '@/stores/static'
    import getItemLevelQuality from '@/utils/get-item-level-quality'
    import getRealmName from '@/utils/get-realm-name'
    import type { CharacterMythicPlusRunMember } from '@/types'
    import type { StaticDataCharacterClass, StaticDataCharacterSpecialization } from '@/stores/static/types/character'

    import ClassIcon from '@/shared/images/ClassIcon.svelte'
    import SpecializationIcon from '@/components/images/SpecializationIcon.svelte'

    export let member: CharacterMythicPlusRunMember

    let cls: StaticDataCharacterClass
    let spec: StaticDataCharacterSpecialization
    $: {
        spec = $staticStore.characterSpecializations[member.specializationId]
        cls = $staticStore.characterClasses[spec.classId]
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
