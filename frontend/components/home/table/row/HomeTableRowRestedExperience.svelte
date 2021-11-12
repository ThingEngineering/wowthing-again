<script lang="ts">
    import { raceMap } from '@/data/character-race'
    import { Constants } from '@/data/constants'
    import { experiencePerLevel } from '@/data/experience'
    import { timeStore } from '@/stores'
    import parseApiTime from '@/utils/parse-api-time'
    import tippy from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character

    let rested = ''
    $: {
        if (character.level < Constants.characterMaxLevel) {
            if (character.lastSeenAddon.startsWith('0001-')) {
                rested = '???'
            }
            else {
                let per = Math.min(150, Math.round(character.restedExperience / experiencePerLevel[character.level] * 100))
                if (per < 150) {
                    const lastSeen = parseApiTime(character.lastSeenAddon)
                    let restedPer = ($timeStore.diff(lastSeen).toMillis() / 1000) / Constants.restedDuration * 150
                    // Outside a resting area is 4x slower
                    if (!character.isResting) {
                        restedPer /= 4
                    }
                    // Pandaren earn rested twice as fast
                    if (raceMap[character.raceId].name === 'Pandaren') {
                        restedPer *= 2
                    }
                    per = Math.floor(Math.min(150, per + restedPer))
                }
                rested = `${per} %`
            }
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-rested);

        text-align: right;

        &.center {
            text-align: center;
        }
    }
</style>

<td
    class:center={rested === '???'}
    use:tippy={"Rested XP"}
>
    {rested}
</td>
