import { createContext } from 'svelte';
import type { SettingsView } from '@/shared/stores/settings/types';

interface HomeContext {
    activeView: SettingsView;
}

export const [getHomeContext, setHomeContext] = createContext<() => HomeContext>();
