<script lang="ts">
    import mdiCheckboxOutline from '@iconify/icons-mdi/check-circle-outline'
    import { itemStore, userQuestStore } from '@/stores'
    import { collectibleState } from '@/stores/local-storage'

    import IconifyIcon from '@/shared/images/IconifyIcon.svelte'
    import WowthingImage from '@/shared/images/sources/WowthingImage.svelte'
    import WowheadLink from '@/shared/links/WowheadLink.svelte'

    export let itemId: number
    export let questId: number

    $: item = $itemStore.items[itemId]
    $: userHas = $userQuestStore.accountHas?.has(questId)
    $: show = userHas
        ? $collectibleState.showCollected['dragonriding']
        : $collectibleState.showUncollected['dragonriding']
    $: showAsMissing = userHas
        ? $collectibleState.highlightMissing['dragonriding']
        : !$collectibleState.highlightMissing['dragonriding']
</script>

{#if show}
    <div
        class="collection-object quality{item.quality}"
        class:has-not={!userHas}
        class:missing={showAsMissing}
    >
        <WowheadLink
            type="item"
            id={itemId}
        >
            <WowthingImage
                name="item/{itemId}"
                size={40}
                border={2}
            />
        </WowheadLink>

        {#if userHas}
            <div class="collected-icon drop-shadow">
                <IconifyIcon icon={mdiCheckboxOutline} />
            </div>
        {/if}
    </div>
{/if}
