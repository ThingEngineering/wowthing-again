import { raidVaultItemLevel } from '@/data/dungeon';
import type { CharacterWeeklyProgress } from '@/types';

export default function getRaidVaultItemLevel(progress: CharacterWeeklyProgress): number[] {
    return raidVaultItemLevel[progress?.level] || [0, 0];
}
