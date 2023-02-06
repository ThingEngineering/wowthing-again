<script lang="ts">
    import { darkmoonFaireProfessionQuests } from '@/data/professions'
    import { userQuestStore } from '@/stores'
    import getPercentClass from '@/utils/get-percent-class'
    import type { Character } from '@/types'

    export let character: Character

    let completed: number
    let total: number
    $: {
        completed = 0
        total = 0

        for (const professionId in (character.professions || {}))
        {
            total++
            
            const questId = darkmoonFaireProfessionQuests[professionId]
            if ($userQuestStore.characters[character.id]?.quests?.has(questId)) {
                completed++
            }

        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-weekly-quest);

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

<td class="{getPercentClass(completed / total * 100)}">
    {completed} / {total}
</td>
