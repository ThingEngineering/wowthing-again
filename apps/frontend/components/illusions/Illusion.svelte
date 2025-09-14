<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { ManualDataIllusionItem } from '@/types/data/manual';

    import ClassIcon from '@/shared/components/images/ClassIcon.svelte';
    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { item }: { item: ManualDataIllusionItem } = $props();

    let illusion = $derived(wowthingData.static.illusionByEnchantmentId.get(item.enchantmentId));
    let have = $derived(userState.general.hasIllusionByEnchantmentId.has(illusion.enchantmentId));
</script>

<style lang="scss">
    .collection-object {
        min-height: 44px;
        width: 44px;
    }
    .player-class {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        left: -1px;
        width: 24px;
        position: absolute;
        top: -1px;
    }
</style>

<div
    class="collection-object"
    class:missing={(browserState.current.illusions.highlightMissing && have) ||
        (!browserState.current.illusions.highlightMissing && !have)}
    data-tooltip={illusion.name}
>
    <WowthingImage name="enchantment/{item.enchantmentId}" size={40} border={2} />

    {#if have}
        <CollectedIcon />
    {/if}

    {#each item.classes || [] as classId (classId)}
        <div class="player-class class-{classId} drop-shadow">
            <ClassIcon border={2} size={20} {classId} />
        </div>
    {/each}
</div>
