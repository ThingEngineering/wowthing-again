<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { Character } from '@/types';
    import type { StaticDataCharacterClass } from '@/shared/stores/static/types/character';

    import WowthingImage from './sources/WowthingImage.svelte';

    export let character: Character = undefined;
    export let characterClass: StaticDataCharacterClass = undefined;
    export let classId = 0;
    export let size = 20;
    export let border = 1;
    export let useTooltip = true;

    let cls: StaticDataCharacterClass;
    let tooltip: string;
    $: {
        cls =
            characterClass ||
            wowthingData.static.characterClassById.get(character?.classId ?? classId);
        if (useTooltip) {
            tooltip = getGenderedName(cls?.name ?? `Unknown class`, character?.gender ?? 0);
        }
    }
</script>

<WowthingImage name="class/{cls.id}" {border} {size} {tooltip} />
