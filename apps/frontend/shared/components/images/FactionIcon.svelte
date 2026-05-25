<script lang="ts">
    import { imageStrings } from '@/data/icons';
    import { Faction } from '@/enums/faction';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = {
        faction: Faction;
        border?: number;
        size?: number;
        useTooltip?: boolean;
    };
    let { faction, border = 1, size = 20, useTooltip }: Props = $props();

    let tooltip = $derived(useTooltip ? Faction[faction] : undefined);
</script>

<WowthingImage
    name={faction === Faction.Alliance ? imageStrings.alliance : imageStrings.horde}
    cls="faction{faction}"
    {border}
    {size}
    {tooltip}
/>
