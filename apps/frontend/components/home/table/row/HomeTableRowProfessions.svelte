<script lang="ts">
    import { imageStrings } from '@/data/icons'
    import { professionIdToSlug } from '@/data/professions'
    import { Region } from '@/enums/region'
    import { staticStore } from '@/shared/stores/static'
    import { getProfessionSortKey } from '@/utils/professions'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { settingsStore } from '@/shared/stores/settings'
    import type { Character, CharacterProfession } from '@/types'
    import type { StaticDataProfession } from '@/shared/stores/static/types'

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let professionType = 0

    let professions: [StaticDataProfession, CharacterProfession, boolean][]
    $: {
        professions = []
        for (const professionId in $staticStore.professions) {
            if (professionId === '794' && !$settingsStore.layout.includeArchaeology) {
                continue
            }

            const profession: StaticDataProfession = $staticStore.professions[professionId]
            if (profession?.type === professionType) {
                if (profession.subProfessions.length > 0) {
                    let found = false
                    for (let i = profession.subProfessions.length; i > 0; i--) {
                        const subProfession = profession.subProfessions[i - 1]
                        const characterSubProfession = character.professions?.[profession.id]?.[subProfession.id]
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
                    const characterProfession = character.professions?.[profession.id]?.[profession.id]
                    professions.push([
                        profession,
                        characterProfession || null,
                        true
                    ])
                }
            }
        }
        professions.sort((a, b) => getProfessionSortKey(a[0]).localeCompare(getProfessionSortKey(b[0])))
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
    a {
        align-items: center;
        color: $body-text;
        display: flex;
        justify-content: space-between;

        span {
            display: block;
            text-align: right;
            width: 2.1rem;
        }

        &:hover {
            text-decoration: underline;
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
                    use:componentTooltip={{
                        component: Tooltip,
                        props: {
                            character,
                            profession,
                        },
                    }}
                >
                    <a href="#/characters/{Region[character.realm.region].toLowerCase()}-{character.realm.slug}/{character.name}/professions/{profession.slug}">
                        <WowthingImage
                            name="{imageStrings[professionIdToSlug[profession.id]]}"
                            size={20}
                            border={1}
                        />
                        <span
                            class:status-fail={!current || currentSkill === 0}
                            class:status-success={current && currentSkill > 0 && currentSkill >= charProfession.maxSkill}
                        >
                            {currentSkill || '---'}
                        </span>
                    </a>
                </div>
            {/each}
        </div>
    {:else}
        &nbsp;
    {/if}
</td>
