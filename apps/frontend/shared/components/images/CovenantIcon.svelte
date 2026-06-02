<script lang="ts">
    import type { Covenant } from '@/types';
    import { covenantMap, covenantNameMap } from '@/data/covenant';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = {
        border?: number;
        size?: number;
        covenant?: Covenant;
        covenantId?: number;
        covenantName?: string;
    };
    let { border = 0, size = 20, covenant, covenantId, covenantName }: Props = $props();

    let derivedCovenant = $derived(
        covenant || covenantMap[covenantId] || covenantNameMap[covenantName]
    );
</script>

<WowthingImage name={derivedCovenant.icon} tooltip={derivedCovenant.name} {size} {border} />
