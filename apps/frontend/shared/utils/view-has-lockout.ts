import { Constants } from '@/data/constants';
import type { SettingsView } from '@/shared/stores/settings/types';
import type { DifficultyData } from '@/types';

export function viewHasLockout(view: SettingsView, difficulty: DifficultyData, instanceId: number) {
    return (
        view.homeLockouts.includes(instanceId) ||
        view.homeLockouts.includes(
            (difficulty?.id || 0) * Constants.lockoutDifficultyMultiplier + instanceId
        )
    );
}
