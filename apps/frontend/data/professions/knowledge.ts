import { Profession } from '@/enums'

type DragonflightKnowledge = {
    name: string
    shortName: string
    icon: string
    masters: Profession[]
}

export const dragonflightKnowledge: DragonflightKnowledge[] = [
    {
        name: 'Valdrakken',
        shortName: 'VD',
        icon: 'achievement/16530',
        masters: [
            Profession.Tailoring,
        ],
    },
    null,
    {
        name: 'Azure Span',
        shortName: 'AS',
        icon: 'achievement/16336',
        masters: [
            Profession.Engineering,
            Profession.Inscription,
            Profession.Jewelcrafting,
        ],
    },
    {
        name: "Ohn'ahran Plains",
        shortName: 'OP',
        icon: 'achievement/15394',
        masters: [
            Profession.Enchanting,
            Profession.Herbalism,
            Profession.Leatherworking,
        ],
    },
    {
        name: 'Thaldraszus',
        shortName: 'TD',
        icon: 'achievement/16363',
        masters: [
            Profession.Mining,
        ],
    },
    {
        name: 'The Waking Shores',
        shortName: 'WS',
        icon: 'achievement/16334',
        masters: [
            Profession.Alchemy,
            Profession.Blacksmithing,
            Profession.Skinning,
        ],
    },
    null,
    {
        name: 'Zaralek Cavern',
        shortName: 'ZC',
        icon: 'achievement/16401',
        masters: [],
    },
]
