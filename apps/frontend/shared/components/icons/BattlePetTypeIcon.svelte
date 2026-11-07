<script lang="ts">
    import { BattlePetType } from '@/enums/battle-pet-type';
    import type { ImageProps } from '@/types/props';

    import WowthingImage from '../images/WowthingImage.svelte';

    type Props = ImageProps & { battlePetType: number };
    let { battlePetType, ...imageProps }: Props = $props();
</script>

<WowthingImage
    name="battle_pet_type_{battlePetType}"
    tooltip={BattlePetType[battlePetType]}
    {...imageProps}
/>
