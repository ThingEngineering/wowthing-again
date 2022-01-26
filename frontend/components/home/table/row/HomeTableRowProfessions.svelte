<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToString } from '@/data/professions'
    import { staticStore } from '@/stores/static'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterProfession } from '@/types'
    import type { StaticDataProfession } from '@/types/data/static'

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let professions: [StaticDataProfession, CharacterProfession, boolean][]
    $: {
        professions = []
        for (const professionId in (character.professions || {})) {
            const profession: StaticDataProfession = $staticStore.data.professions[professionId]
            if (profession?.type === 0) {
                for (let i = profession.subProfessions.length; i > 0; i--) {
                    const subProfession = profession.subProfessions[i - 1]
                    const characterSubProfession = character.professions[profession.id][subProfession.id]
                    if (characterSubProfession) {
                        professions.push([
                            profession,
                            characterSubProfession,
                            i === profession.subProfessions.length
                        ])
                        break
                    }
                }
            }
        }
        professions.sort((a, b) => a[0].name.localeCompare(b[0].name))
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-professions);

        border-left: 1px solid $border-color;
    }
    .flex-wrapper {
        width: 100%;
    }
    .profession {
        display: flex;
        justify-content: space-between;

        span {
            display: block;
            text-align: right;
            width: 2.1rem;
        }
    }
</style>

<td>
    {#if professions.length > 0}
        <div class="flex-wrapper">
            {#each professions as [profession, charProfession, current]}
                <div
                    class="profession"
                    use:tippyComponent={{
                        component: Tooltip,
                        props: {
                            character,
                            profession,
                        },
                    }}
                >
                    <WowthingImage
                        name="{imageStrings[professionIdToString[profession.id]]}"
                        size={20}
                        border={1}
                    />
                    <span
                        class:status-fail={!current}
                        class:status-success={charProfession.currentSkill >= charProfession.maxSkill}
                    >
                        {charProfession.currentSkill}
                    </span>
                </div>
            {/each}
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
