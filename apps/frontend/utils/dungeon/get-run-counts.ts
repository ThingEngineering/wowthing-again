import type { CharacterMythicPlusAddonRun } from '@/types';

export function getRunCounts(runs: CharacterMythicPlusAddonRun[]): number[] {
    const runCounts = [0, 0, 0, 0, 0, 0, 0];
    for (const run of runs || []) {
        if (run.level <= 5) {
            runCounts[0]++;
        } else if (run.level <= 10) {
            runCounts[1]++;
        } else if (run.level <= 15) {
            runCounts[2]++;
        } else if (run.level <= 20) {
            runCounts[3]++;
        } else if (run.level <= 25) {
            runCounts[4]++;
        } else if (run.level <= 30) {
            runCounts[5]++;
        } else {
            runCounts[6]++;
        }
    }

    while (runCounts[runCounts.length - 1] === 0) {
        runCounts.pop();
    }

    return runCounts;
}
