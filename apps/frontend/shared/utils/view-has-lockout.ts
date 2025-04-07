import type { SettingsView } from '@/shared/stores/settings/types';
import type { Difficulty } from '@/types';

export function viewHasLockout(view: SettingsView, difficulty: Difficulty, instanceId: number) {
    return (
        view.homeLockouts.includes(instanceId) ||
        view.homeLockouts.includes((difficulty?.id || 0) * 10000000 + instanceId)
    );
}
