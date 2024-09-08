import { Profession } from '@/enums/profession';
import type { TaskProfession } from '@/types/data';

export const warWithinBlacksmithing: TaskProfession = {
    id: Profession.Blacksmithing,
    subProfessionId: 2872,
    hasOrders: true,
    bookQuests: [
        {
            itemId: 227407, // Faded Blacksmith's Diagrams
            questId: 84226,
            source: 'AC',
        },
        {
            itemId: 227418, // Exceptional Blacksmith's Diagrams
            questId: 84227,
            source: 'AC',
        },
        {
            itemId: 227429, // Pristine Blacksmith's Diagrams
            questId: 84228,
            source: 'AC',
        },
        {
            itemId: 224647, // Jewel-Etched Blacksmithing Notes
            questId: 83059,
            source: 'CoD 12',
        },
        {
            itemId: 224038, // Smithing After Saronite
            questId: 82631,
            source: 'CoT',
        },
    ],
    dropQuests: [
        {
            itemId: 225232, // Coreway Billet
            questId: 83257,
            source: 'Mobs/Treasures',
        },
        {
            itemId: 225233, // Dense Bladestone
            questId: 83256,
            source: 'Mobs/Treasures',
        },
    ],
    treasureQuests: [],
};

export const dragonflightBlacksmithing: TaskProfession = {
    id: Profession.Blacksmithing,
    subProfessionId: 2822,
    hasTasks: true,
    hasOrders: true,
    masterQuestId: 70250,
    bookQuests: [
        {
            itemId: 200972, // Artisan's Consortium, Preferred
            questId: 71894,
            source: 'AC 2',
        },
        {
            itemId: 201268, // Artisan's Consortium, Valued
            questId: 71905,
            source: 'AC 4',
        },
        {
            itemId: 201279, // Artisan's Consortium, Esteemed
            questId: 71916,
            source: 'AC 5',
        },
        {
            itemId: 201708, // Notebook of Crafting Knowledge
            questId: 72312, // A Gift of Knowledge
            source: 'MC 14',
        },
        {
            itemId: 201708, // Notebook of Crafting Knowledge
            questId: 72315, // A Gift of Secrets
            source: 'MC 24',
        },
        {
            itemId: 201708, // Notebook of Crafting Knowledge
            questId: 72329, // Crafting Your Start
            source: 'VA 14',
        },
        {
            itemId: 201708, // Notebook of Crafting Knowledge
            questId: 70909, // Crafting for Expertise
            source: 'VA 24',
        },
        {
            itemId: 205352, // Niffen Notebook of Blacksmithing Knowledge
            questId: 75755,
            source: 'LN',
        },
        {
            itemId: 205439, // Bartered Blacksmithing Journal
            questId: 75849,
            source: 'ZCB',
        },
        {
            itemId: 205428, // Bartered Blacksmithing Notes
            questId: 75846,
            source: 'ZCB',
        },
    ],
    dropQuests: [
        {
            itemId: 192131, // Valdrakken Weapon Chain
            questId: 66381,
            source: 'Treasures',
        },
        {
            itemId: 192132, // Draconium Blade Sharpener
            questId: 66382,
            source: 'Treasures',
        },
        {
            itemId: 198965, // Primeval Earth Fragment
            questId: 70512,
            source: 'Mobs: Earth',
        },
        {
            itemId: 198966, // Molten Globule
            questId: 70513,
            source: 'Mobs: Fire',
        },
        {
            itemId: 204230, // Dense Seaforged Javelin
            questId: 74325,
            source: 'FR: Tidesmith Zarviss',
        },
    ],
    treasureQuests: [
        {
            itemId: 201007, // Ancient Monument
            questId: 70246,
            source: 'WS',
        },
        {
            itemId: 201004, // Ancient Spear Shards
            questId: 70313,
            source: 'OP',
        },
        {
            itemId: 201005, // Curious Ingots
            questId: 70312,
            source: 'WS',
        },
        {
            itemId: 201006, // Draconic Flux
            questId: 70311,
            source: 'TD',
        },
        {
            itemId: 201009, // Falconer Gauntlet Drawings
            questId: 70353,
            source: 'OP',
        },
        {
            itemId: 198791, // Glimmer of Blacksmithing Wisdom
            questId: 70314,
            source: 'WS',
        },
        {
            itemId: 201008, // Molten Ingot
            questId: 70296,
            source: 'WS',
        },
        {
            itemId: 201010, // Qalashi Weapon Diagram
            questId: 70310,
            source: 'WS',
        },
        {
            itemId: 201011, // Spelltouched Tongs
            questId: 70314,
            source: 'AS',
        },
        {
            itemId: 205987, // Brimstone Rescue Ring
            questId: 76079,
            source: 'ZC',
        },
        {
            itemId: 205986, // Well-Worn Kiln
            questId: 76078,
            source: 'ZC',
        },
        {
            itemId: 205988, // Zaqali Elder Spear
            questId: 76080,
            source: 'ZC',
        },
        {
            itemId: 210464, // Amirdrassil Defender's Shield
            questId: 78417,
            source: 'ED',
        },
        {
            itemId: 210465, // Deathstalker Chassis
            questId: 78418,
            source: 'ED',
        },
        {
            itemId: 210466, // Flamesworn Render
            questId: 78419,
            source: 'ED',
        },
    ],
};
