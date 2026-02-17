<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import type { StaticDataCharacterClass } from '@/shared/stores/static/types/character';
    import type { CharacterProps } from '@/types/props';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = Partial<CharacterProps> & {
        border?: number;
        characterClass?: StaticDataCharacterClass;
        classId?: number;
        size?: number;
        tooltip?: string;
        useTooltip?: boolean;
    };
    let {
        character,
        characterClass,
        border = 1,
        classId = 0,
        size = 20,
        tooltip,
        useTooltip = true,
    }: Props = $props();

    let cls = $derived(
        characterClass || wowthingData.static.characterClassById.get(character?.classId ?? classId)
    );
    let finalTooltip = $derived(
        tooltip ||
            (useTooltip
                ? getGenderedName(cls?.name ?? `Unknown class`, character?.gender ?? 0)
                : undefined)
    );
</script>

<WowthingImage name="class/{cls.id}" {border} {size} tooltip={finalTooltip} />
