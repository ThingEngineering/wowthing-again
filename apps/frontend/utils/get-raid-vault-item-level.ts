import { raidVaultItemLevel } from '@/data/dungeon';
import type { CharacterWeeklyProgress } from '@/types';

export default function getRaidVaultItemLevel(progress?: CharacterWeeklyProgress): number[] {
    const data = raidVaultItemLevel[progress?.level];
    if (progress?.itemLevel) {
        return [progress.itemLevel, data?.[1] || 0];
    } else {
        return raidVaultItemLevel[progress?.level] || [0, 0];
    }
}
