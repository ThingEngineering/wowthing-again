<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { Character } from '@/types';
    import type { StaticDataCharacterSpecialization } from '@/shared/stores/static/types/character';

    import WowthingImage from './sources/WowthingImage.svelte';

    export let character: Character = undefined;
    export let characterSpec: StaticDataCharacterSpecialization = undefined;
    export let specId = 0;
    export let size = 20;
    export let border = 1;

    let spec: StaticDataCharacterSpecialization;
    let tooltip: string;
    $: {
        spec =
            characterSpec ||
            wowthingData.static.characterSpecializationById.get(character?.activeSpecId || specId);
        tooltip = getGenderedName(spec?.name ?? 'Unknown', character?.gender ?? 0);
    }
</script>

<WowthingImage name="spec/{spec?.id ?? 0}" {size} {border} {tooltip} />
