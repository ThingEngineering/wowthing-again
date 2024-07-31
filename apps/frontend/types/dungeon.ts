import type { Difficulty } from '@/types/difficulty'
import type { TippyProps } from '@/shared/utils/tooltips/types'


export class Dungeon {
    timer1: number
    timer2: number
    timer3: number

    constructor(
        public id: number,
        public name: string,
        public abbreviation: string,
        public icon: string,
        timerMinutes: number,
    ) {
        this.timer1 = timerMinutes * 60 * 1000
        this.timer2 = this.timer1 * 0.8
        this.timer3 = this.timer1 * 0.6
    }

    getTooltip(): TippyProps {
        return {
            content: `${this.name}`,
        }
    }

    getTimed(ms: number): DungeonTimedResult {
        if (ms < this.timer3) {
            return {
                plus: 3,
                under: this.timer3 - ms,
            }
        } else if (ms < this.timer2) {
            return {
                plus: 2,
                under: this.timer2 - ms,
                over: ms - this.timer3,
            }
        } else if (ms < this.timer1) {
            return {
                plus: 1,
                under: this.timer1 - ms,
                over: ms - this.timer2,
            }
        } else {
            return {
                plus: 0,
                over: ms - this.timer1,
            }
        }
    }
}

export interface DungeonTimedResult {
    plus: number
    under?: number
    over?: number
}

export interface InstanceDifficulty {
    difficulty: Difficulty
    instanceId: number
    key: string
}
