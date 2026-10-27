<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { Gender } from '@/enums/gender';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { Character } from '@/types';
    import type { StaticDataCharacterRace } from '@/shared/stores/static/types/character';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = {
        border?: number;
        size?: number;
        character?: Character;
        characterRace?: StaticDataCharacterRace;
        gender?: number;
        raceId?: number;
    };
    let {
        border = 1,
        size = 20,
        gender = 0,
        raceId = 0,
        character,
        characterRace,
    }: Props = $props();

    let race = $derived(
        characterRace || wowthingData.static.characterRaceById.get(character?.raceId || raceId)
    );
    let derivedGender = $derived(character?.gender || gender || 0);
    let tooltip = $derived(
        `${Gender[derivedGender]} ${getGenderedName(race?.name ?? 'Unknown', derivedGender)}`
    );
</script>

<WowthingImage name="race_{race.id}_{derivedGender}" {size} {border} {tooltip} />
