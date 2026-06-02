<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { Character } from '@/types';
    import type { StaticDataCharacterSpecialization } from '@/shared/stores/static/types/character';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = {
        border?: number;
        size?: number;
        character?: Character;
        characterSpec?: StaticDataCharacterSpecialization;
        specId?: number;
    };
    let { border = 1, size = 20, character, characterSpec, specId }: Props = $props();

    let spec = $derived(
        characterSpec ||
            wowthingData.static.characterSpecializationById.get(character?.activeSpecId || specId)
    );
    let tooltip = $derived(getGenderedName(spec?.name ?? 'Unknown', character?.gender ?? 0));
</script>

<WowthingImage name="spec/{spec?.id ?? 0}" {size} {border} {tooltip} />
