<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'

    import { dragonflightProfessionMap, type DragonflightProfession } from '@/data/professions'
    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { itemStore, userQuestStore } from '@/stores'
    import type { Character } from '@/types'
    import type { StaticDataProfession } from '@/types/data/static'
    
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let expansionSlug: string
    export let staticProfession: StaticDataProfession

    let dfData: DragonflightProfession
    $: {
        dfData = undefined

        const expansion = expansionSlugMap[expansionSlug]
        if (!expansion || expansion.id !== Constants.expansion) {
            break $
        }
        
        const charProfession = character.professions[staticProfession.id]
        const charSubProfession = charProfession?.[staticProfession.subProfessions[expansion.id].id]
        if (!charSubProfession) {
            break $
        }
        
        dfData = dragonflightProfessionMap[staticProfession.id]
    }
</script>

<style lang="scss">
    .profession-collectibles {
        --image-border-width: 2px;

        justify-content: center;
        margin: 1rem 1rem 0 1rem;
    }
</style>

{#if dfData}
    <div class="profession-collectibles collection-objects">
        {#if dfData.masterQuestId}
            {@const userHas = userQuestStore.hasAny(character.id, dfData.masterQuestId)}
            <div
                class="quality5"
                class:missing={userHas}
            >
                <WowthingImage
                    name="achievement/1683"
                    size={48}
                    border={2}
                    tooltip={"Profession Master"}
                />

                {#if userHas}
                    <div class="collected-icon drop-shadow">
                        <IconifyIcon icon={mdiCheckboxOutline} />
                    </div>
                {/if}
            </div>
        {/if}

        {#each (dfData.treasureQuests || []) as treasureQuest}
            {@const userHas = userQuestStore.hasAny(character.id, treasureQuest.questId)}
            <div
                class="quality{$itemStore.items[treasureQuest.itemId]?.quality || 1}"
                class:missing={userHas}
            >
                <WowheadLink
                    type="item"
                    id={treasureQuest.itemId}
                >
                    <WowthingImage
                        name="item/{treasureQuest.itemId}"
                        size={48}
                        border={2}
                    />
                </WowheadLink>

                {#if userHas}
                    <div class="collected-icon drop-shadow">
                        <IconifyIcon icon={mdiCheckboxOutline} />
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/if}
