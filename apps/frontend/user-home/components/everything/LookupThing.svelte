<script lang="ts">
    import { ItemQuality } from '@/enums/item-quality';
    import { LookupType } from '@/enums/lookup-type';
    import { RewardType } from '@/enums/reward-type';
    import { rewardTypeIcons } from '@/shared/icons/mappings';
    import { wowthingData } from '@/shared/stores/data';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
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
        } else if (lookupType === LookupType.Pet) {
            const pet = wowthingData.static.petById.get(lookupId);
            if (pet.itemIds?.length > 0) {
                ret.linkId = pet.itemIds[0];
            }
        } else if (
            lookupType === LookupType.Illusion ||
            lookupType === LookupType.Quest ||
            lookupType === LookupType.Recipe ||
            lookupType === LookupType.Toy
        ) {
            ret.linkId = originalId;
        } else if (lookupType === LookupType.Transmog) {
            ret.linkId = lookupId;
        } else {
            console.log(LookupType[lookupType], lookupId);
        }

        if (ret.linkType === 'item') {
            ret.quality = wowthingData.items.items[ret.linkId]?.quality || ItemQuality.Poor;
        }

        return ret;
    });
</script>

<style lang="scss">
    .icon {
        --image-border-radius: 50%;
        --image-margin-top: -4px;
        --shadow-color: rgba(0, 0, 0, 0.8);

        border: none;
        height: 24px;
        width: 24px;
        pointer-events: none;
        position: absolute;
    }
    .icon-class {
        left: -2px;
        top: -1px;
    }
</style>

<div class="collection-object quality{quality}" class:missing={userHas}>
    <WowheadLink id={linkId} type={linkType}>
        <WowthingImage name="{linkType}/{linkId}" size={48} border={2} />
    </WowheadLink>

    {#if userHas}
        <CollectedIcon />
    {/if}

    {#if lookupType === LookupType.Mount || lookupType === LookupType.Pet || lookupType === LookupType.Toy}
        <div class="icon icon-class quality1 drop-shadow">
            <IconifyIcon
                icon={lookupType === LookupType.Mount
                    ? rewardTypeIcons[RewardType.Mount]
                    : lookupType === LookupType.Pet
                      ? rewardTypeIcons[RewardType.Pet]
                      : rewardTypeIcons[RewardType.Toy]}
            />
        </div>
    {/if}
</div>
