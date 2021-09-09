import type { Dictionary } from '@/types/dictionary'


export interface UserQuestData {
    quests?: Record<number, Map<number, boolean>>
    questsPacked: Record<number, string>
}
