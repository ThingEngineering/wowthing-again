<script lang="ts">
    import { getContext } from 'svelte'

    import { badgeToClass } from '@/data/dungeon'
    import type { Character, MythicPlusSeason } from '@/types'

    import TableIcon from '@/components/common/TableIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let season: MythicPlusSeason

    const character: Character = getContext('character')

    let badge: string
    $: badge = character.mythicPlus?.seasonBadges?.[season.Id]
</script>

<TableIcon padRight="0.5rem">
    {#if badge !== undefined}
        <WowthingImage
            name="mythic_plus_{badge}"
            cls={badgeToClass[badge]}
            size={20}
            border={1}
            tooltip="All timed +{badge} or higher"
        />
    {/if}
</TableIcon>
