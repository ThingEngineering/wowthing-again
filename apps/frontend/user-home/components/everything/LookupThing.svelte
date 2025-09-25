<script lang="ts">
    import { ItemQuality } from '@/enums/item-quality';
    import { LookupType } from '@/enums/lookup-type';
    import { wowthingData } from '@/shared/stores/data';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        lookupId: number;
        lookupType: LookupType;
        originalId: number;
        userHas: boolean;
    };
    let { lookupId, lookupType, originalId, userHas }: Props = $props();

    let { linkId, linkType, quality } = $derived.by(() => {
        const ret = { linkId: 0, linkType: 'item', quality: ItemQuality.Poor };

        if (lookupType === LookupType.Mount) {
            const mount = wowthingData.static.mountById.get(lookupId);
            if (mount.itemIds?.length > 0) {
                ret.linkId = mount.itemIds[0];
            }
        } else if (lookupType === LookupType.Quest) {
            ret.linkId = originalId;
        } else if (lookupType === LookupType.Transmog) {
            ret.linkId = lookupId;
        }

        if (ret.linkType === 'item') {
            ret.quality = wowthingData.items.items[ret.linkId]?.quality || ItemQuality.Poor;
        }

        return ret;
    });
</script>

<div class="collection-object quality{quality}" class:missing={userHas}>
    <WowheadLink id={linkId} type={linkType}>
        <WowthingImage name="{linkType}/{linkId}" size={48} border={2} />
    </WowheadLink>

    {#if userHas}
        <CollectedIcon />
    {/if}
</div>
