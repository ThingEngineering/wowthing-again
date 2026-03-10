import { getContext } from 'svelte';

import type { CollectibleContext } from '@/types/contexts';

export const getCollectibleContext = () => getContext<() => CollectibleContext>('collectible')();
