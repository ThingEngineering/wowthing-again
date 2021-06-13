import type { TippyProps } from '@/types/tippy'

export class Covenant {
    Name: string
    Icon: string

    constructor(name: string, icon: string) {
        this.Name = name
        this.Icon = icon
    }

    getTooltip(renown: number): TippyProps {
        return {
            content: `${this.Name} R${renown}`,
        }
    }
}
