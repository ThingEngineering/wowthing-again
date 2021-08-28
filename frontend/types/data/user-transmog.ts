import type { Dictionary } from '@/types/dictionary'


export interface UserTransmogData {
    has?: Dictionary<UserTransmogDataHas>
    transmog: Dictionary<number>
}

export class UserTransmogDataHas {
    constructor(
        public have: number,
        public total: number
    )
    { }
}
