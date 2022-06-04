<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToString } from '@/data/professions'
    import { data as settings } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterProfession } from '@/types'
    import type { StaticDataProfession } from '@/types/data/static'

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let professionType = 0

    let professions: [StaticDataProfession, CharacterProfession, boolean][]
    $: {
        professions = []
        for (const professionId in $staticStore.data.professions) {
            if (professionId === '794' && !$settings.layout.includeArchaeology) {
                continue
            }

            //for (const professionId in (character.professions || {})) {
            const profession: StaticDataProfession = $staticStore.data.professions[professionId]
            if (profession?.type === professionType) {
                if (profession.subProfessions.length > 0) {
                    let found = false
                    for (let i = profession.subProfessions.length; i > 0; i--) {
                        const subProfession = profession.subProfessions[i - 1]
                        const characterSubProfession = character.professions[profession.id]?.[subProfession.id]
                        if (characterSubProfession) {
                            professions.push([
                                profession,
                                characterSubProfession,
                                i === profession.subProfessions.length
                            ])
                            found = true
                            break
                        }
                    }

                    if (!found && professionType === 1) {
                        professions.push([
                            profession,
                            null,
                            true
                        ])
                    }
                }
                else {
                    const characterProfession = character.professions[profession.id]?.[profession.id]
                    professions.push([
                        profession,
                        characterProfession || null,
                        true
                    ])
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

        &.triple {
            @include cell-width($width-professions-triple);
        }
    }
    .flex-wrapper {
        width: 100%;
    }
    .profession {
        align-items: center;
        display: flex;
        justify-content: space-between;

        span {
            display: block;
            text-align: right;
            width: 2.1rem;
        }
    }
</style>

<td class:triple={professions.length === 3}>
    {#if professions.length > 0}
        <div class="flex-wrapper">
            {#each professions as [profession, charProfession, current]}
                {@const currentSkill = charProfession?.currentSkill || 0}
                <div
                    class="profession"
                    data-id="{profession.id}"
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
                        class:status-fail={!current || currentSkill === 0}
                        class:status-success={currentSkill >0 && currentSkill >= charProfession.maxSkill}
                    >
                        {currentSkill || '---'}
                    </span>
                </div>
            {/each}
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
