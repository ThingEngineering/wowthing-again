<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import getRealmName from '@/utils/get-realm-name';
    import type { CharacterMythicPlusRunMember } from '@/types';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';

    let { member }: { member: CharacterMythicPlusRunMember } = $props();

    let spec = $derived(
        wowthingData.static.characterSpecializationById.get(member.specializationId)
    );
    let cls = $derived(wowthingData.static.characterClassById.get(spec.classId));
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
