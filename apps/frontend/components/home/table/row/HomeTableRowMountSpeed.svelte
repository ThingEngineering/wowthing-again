<script lang="ts">
    import { mountSkillMap } from '@/data/mount-skill'
    import { userStore } from '@/stores'
    import tippy from '@/utils/tippy'
    import type { MountSkill } from '@/data/mount-skill'
    import type { Character } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let speed: number
    let spellId: number
    let afford: boolean
    let maxed: boolean
    let nextSkill: MountSkill

    $: {
        const mountSkill: MountSkill = mountSkillMap[character.mountSkill]
        if (mountSkill !== undefined) {
            speed = mountSkill.speed
            spellId =
                character.faction === 0
                    ? mountSkill.allianceSpellId
                    : mountSkill.hordeSpellId
            nextSkill = mountSkillMap[character.mountSkill + 1]
        }
        else {
            speed = 0
            spellId = 296113 // Old Heavy Boot
            nextSkill = mountSkillMap[1]
        }

        if (nextSkill) {
            // Stupid deprecated skill
            if (nextSkill.requiredLevel === -1) {
                nextSkill = mountSkillMap[character.mountSkill + 2]
            }

            afford = character.gold >= nextSkill.price
            maxed = character.level < nextSkill.requiredLevel
        }
        else {
            maxed = true
        }
    }

    let cls: string
    let tooltip: string
    $: {
        if (maxed) {
            cls = 'status-success'
            tooltip = 'Your mount speed is maxed out!'
        }
        else {
            if (afford || $userStore.public) {
                cls = 'status-shrug'
                tooltip = `Upgrade to ${nextSkill.speed}% ${nextSkill.speed > 100 ? 'flying' : 'ground'} for ${nextSkill.price.toLocaleString()}g!`
            }
            else {
                cls = 'status-fail'
                tooltip = `You need ${nextSkill.price.toLocaleString()}g to upgrade!`
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-mount-speed);

        border-left: 1px solid $border-color;
    }
</style>

<td class="{cls}" use:tippy={tooltip}>
    <div class="flex-wrapper">
        <WowthingImage name="spell/{spellId}" size={20} border={1} />
        <span>{speed}</span>
    </div>
</td>
