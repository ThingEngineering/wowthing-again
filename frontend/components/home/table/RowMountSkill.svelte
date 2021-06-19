<script lang="ts">
    import { getContext } from 'svelte'

    import { mountSkillMap } from '@/data/mount-skill'
    import { data as userData } from '@/stores/user'
    import type { Character } from '@/types'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    const character: Character = getContext('character')

    let speed: number
    let spellId: number
    let afford: boolean
    let upgrade: boolean
    $: {
        const mountSkill = mountSkillMap[character.mountSkill]
        if (mountSkill !== undefined) {
            speed = mountSkill.speed
            spellId =
                character.faction === 0
                    ? mountSkill.allianceSpellId
                    : mountSkill.hordeSpellId

            let nextSkill = mountSkillMap[character.mountSkill + 1]
            if (nextSkill) {
                // Stupid deprecated skill
                if (nextSkill.requiredLevel === -1) {
                    nextSkill = mountSkillMap[character.mountSkill + 2]
                }

                afford = character.gold >= nextSkill.price
                upgrade = character.level >= nextSkill.requiredLevel
            }
        }
    }
</script>

<style lang="scss">
    td {
        text-align: right;
        width: 2.1rem;

        &.success {
            color: #1eff00;
        }
        &.broke {
            color: #ff1e00;
        }
    }
</style>

{#if speed > 0}
    <TableIcon>
        <WowthingImage name="spell/{spellId}" size={20} border={1} />
    </TableIcon>
    <td
        class:success={upgrade && (afford || $userData.public)}
        class:broke={upgrade && !afford && !$userData.public}>{speed}</td
    >
{:else}
    <TableIcon />
    <td>&nbsp;</td>
{/if}
