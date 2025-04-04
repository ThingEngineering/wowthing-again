import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinEngineering: TaskProfession = {
    id: Profession.Engineering,
    subProfessionId: 2875,
    hasOrders: true,
    bookQuests: [
        {
            itemId: 227412, // Faded Engineer's Scribblings
            questId: 84229,
            source: 'AC',
            costs: [{ amount: 200, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227423, // Exceptional Engineer's Scribblings
            questId: 84230,
            source: 'AC',
            costs: [{ amount: 300, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 227434, // Pristine Engineer's Scribblings
            questId: 84231,
            source: 'AC',
            costs: [{ amount: 400, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224653, // Machine-Learned Engineering Notes
            questId: 83063,
            source: 'AotD 12',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
        {
            itemId: 224052, // Clocks, Gears, Sprockets, and Legs
            questId: 82632,
            source: 'CoT',
            costs: [{ amount: 565, currencyId: 3056 }], // Kej
        },
        {
            itemId: 232507, // Undermine Treatise on Engineering
            questId: 85737,
            source: 'UM 16',
            costs: [{ amount: 50, itemId: 210814 }], // Artisan's Acuity
        },
    ],
    dropQuests: [
        {
            itemId: 225229, // Earthen Induction Coil
            questId: 83261,
            source: 'Mobs/Treasures',
        },
        {
            itemId: 225228, // Rust-Locked Mechanism
            questId: 83260,
            source: 'Mobs/Treasures',
        },
    ],

    treasureQuests: [],
};

export const dragonflightEngineering: TaskProfession = {
    id: Profession.Engineering,
    subProfessionId: 2827,
    hasTasks: true,
    hasOrders: true,
    masterQuestId: 70252,
    bookQuests: [
        {
            itemId: 200977, // Artisan's Consortium, Preferred
            questId: 71896,
            source: 'AC 2',
        },
        {
            itemId: 201273, // Artisan's Consortium, Valued
            questId: 71907,
            source: 'AC 4',
        },
        {
            itemId: 201284, // Artisan's Consortium, Esteemed
            questId: 71918,
            source: 'AC 5',
        },
        {
            itemId: 201710, // Notebook of Crafting Knowledge
            questId: 72300, // Expedition Crafting Knowledge
            source: 'DE 14',
        },
        {
            itemId: 201710, // Notebook of Crafting Knowledge
            questId: 72305, // Expedition Crafting Knowledge
            source: 'DE 23',
        },
        {
            itemId: 201710, // Notebook of Crafting Knowledge
            questId: 72330, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201710, // Notebook of Crafting Knowledge
            questId: 70902, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205349, // Niffen Notebook of Engineering Knowledge
            questId: 75759,
            source: 'LN',
        },
        {
            itemId: 205436, // Bartered Engineering Journal
            questId: 75851,
            source: 'ZCB',
        },
        {
            itemId: 205425, // Bartered Engineering Notes
            questId: 75844,
            source: 'ZCB',
        },
    ],
    dropQuests: [
        {
            itemId: 193902, // Eroded Titan Gizmo
            questId: 66379,
            source: 'Treasures',
        },
        {
            itemId: 193903, // Watcher Power Core
            questId: 66380,
            source: 'Treasures',
        },
        {
            itemId: 198969, // Keeper's Mark
            questId: 70516,
            source: 'Mobs: Keeper',
        },
        {
            itemId: 198970, // Infinitely Attachable Pair o' Docks
            questId: 70517,
            source: 'Mobs: Dragonkin',
        },
        {
            itemId: 204227, // Everflowing Antifreeze
            questId: 74330,
            source: 'FR: Fimbol',
        },
    ],
    treasureQuests: [
        {
            itemId: 201014, // Boomthyr Rocket,
            questId: 70270,
            source: 'WS',
        },
        {
            itemId: 204475, // Busted Wyrmhole Generator
            questId: 75186,
            source: 'ZC',
        },
        {
            itemId: 204471, // Defective Survival Pack
            questId: 75184,
            source: 'ZC',
        },
        {
            itemId: 204853, // Discarded Dracothyst Drill
            questId: 75431,
            source: 'ZC',
        },
        {
            itemId: 204850, // Handful of Khaz'gorite Bolts
            questId: 75430,
            source: 'ZC',
        },
        {
            itemId: 204470, // Haphazardly Discarded Bomb
            questId: 75183,
            source: 'ZC',
        },
        {
            itemId: 204480, // Inconspicuous Data Miner
            questId: 75188,
            source: 'ZC',
        },
        {
            itemId: 198789, // Intact Coil Capacitor
            questId: 70275,
            source: 'WS',
        },
        {
            itemId: 204469, // Misplaced Aberrus Outflow Blueprints
            questId: 75180,
            source: 'ZC',
        },
        {
            itemId: 204855, // Overclocked Determination Core
            questId: 75433,
            source: 'ZC',
        },
        {
            itemId: 210193, // Experimental Dreamcatcher
            questId: 78278,
            source: 'ED',
        },
        {
            itemId: 210194, // Insomniotron
            questId: 78279,
            source: 'ED',
        },
        {
            itemId: 210197, // Unhatched Battery
            questId: 78281,
            source: 'ED',
        },
    ],
};
