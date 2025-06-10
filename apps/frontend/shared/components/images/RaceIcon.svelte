<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { Gender } from '@/enums/gender';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { Character } from '@/types';
    import type { StaticDataCharacterRace } from '@/shared/stores/static/types/character';

    import WowthingImage from './sources/WowthingImage.svelte';

    export let character: Character = undefined;
    export let characterRace: StaticDataCharacterRace = undefined;
    export let gender = 0;
    export let raceId = 0;
    export let size = 20;
    export let border = 1;

    let race: StaticDataCharacterRace;
    let tooltip: string;
    $: {
        race =
            characterRace || wowthingData.static.characterRaceById.get(character?.raceId || raceId);
        tooltip = `${Gender[character?.gender || gender]} ${getGenderedName(race?.name ?? 'Unknown', character?.gender ?? 0)}`;
    }
</script>

<WowthingImage name="race_{race.id}_{character?.gender ?? 0}" {size} {border} {tooltip} />
