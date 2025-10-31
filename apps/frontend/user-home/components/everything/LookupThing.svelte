<script lang="ts">
    import { ItemQuality } from '@/enums/item-quality';
    import { LookupType } from '@/enums/lookup-type';
    import { RewardType } from '@/enums/reward-type';
    import { armorTypeComponents, armorTypeIcons, rewardTypeIcons } from '@/shared/icons/mappings';
    import { wowthingData } from '@/shared/stores/data';

    import CollectedIcon from '@/shared/components/collected-icon/CollectedIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { ArmorType } from '@/enums/armor-type';
    import { ItemClass } from '@/enums/item-class';
    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    type Props = {
        lookupId: number;
        lookupType: LookupType;
        originalId: number;
        userHas: boolean;
        quality?: number;
    };
    let { lookupId, lookupType, originalId, quality, userHas }: Props = $props();

    let { armorType, linkId, linkType, linkQuality } = $derived.by(() => {
        const ret = {
            armorType: ArmorType.None,
            linkId: 0,
            linkType: 'item',
            linkQuality: ItemQuality.Poor,
        };

        if (lookupType === LookupType.Mount) {
            const mount = wowthingData.static.mountById.get(lookupId);
            if (mount.itemIds?.length > 0) {
                ret.linkId = mount.itemIds[0];
            }
        } else if (lookupType === LookupType.Pet) {
            const pet = wowthingData.static.petById.get(lookupId);
            if (pet.itemIds?.length > 0) {
                ret.linkId = pet.itemIds[0];
            } else if (pet.spellId) {
                ret.linkId = pet.spellId;
                ret.linkType = 'spell';
            } else {
                ret.linkId = pet.creatureId;
                ret.linkType = 'npc';
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
            const item = wowthingData.items.items[lookupId];
            if (item?.classId === ItemClass.Armor) {
                if (item.subclassId === ArmorType.Cloth) {
                    ret.armorType = ArmorType.Cloth;
                } else if (item.subclassId === ArmorType.Leather) {
                    ret.armorType = ArmorType.Leather;
                } else if (item.subclassId === ArmorType.Mail) {
                    ret.armorType = ArmorType.Mail;
                } else if (item.subclassId === ArmorType.Plate) {
                    ret.armorType = ArmorType.Plate;
                }
            }
        } else {
            console.log(LookupType[lookupType], lookupId);
        }

        if (ret.linkType === 'item') {
            ret.linkQuality =
                quality || wowthingData.items.items[ret.linkId]?.quality || ItemQuality.Poor;
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

<div class="collection-object quality{linkQuality}" class:missing={userHas}>
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
    {:else if armorType !== ArmorType.None}
        <div class="icon icon-class quality1 drop-shadow">
            <IconifyWrapper Icon={armorTypeComponents[armorType]} scale="1.3" />
        </div>
    {/if}
</div>
