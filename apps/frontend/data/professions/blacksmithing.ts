import { Profession } from '@/enums'
import type { DragonflightProfession } from '@/types/data'


export const dragonflightBlacksmithing: DragonflightProfession = {
    id: Profession.Blacksmithing,
    hasCraft: true,
    hasOrders: true,
    masterQuestId: 70250,
    bookQuests: [
        {
            itemId: 200972, // Artisan's Consortium, Preferred
            questId: 71894,
        },
        {
            itemId: 201268, // Artisan's Consortium, Valued
            questId: 71905,
        },
        {
            itemId: 201279, // Artisan's Consortium, Esteemed
            questId: 71916,
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
    ],
    treasureQuests: [
        {
            itemId: 201007, // Ancient Monument
            questId: 70246,
        },
        {
            itemId: 201004, // Ancient Spear Shards
            questId: 70313,
        },
        {
            itemId: 201005, // Curious Ingots
            questId: 70312,
        },
        {
            itemId: 201006, // Draconic Flux
            questId: 70311,
        },
        {
            itemId: 201009, // Falconer Gauntlet Drawings
            questId: 70353,
        },
        {
            itemId: 198791, // Glimmer of Blacksmithing Wisdom
            questId: 70314,
        },
        {
            itemId: 201008, // Molten Ingot
            questId: 70296,
        },
        {
            itemId: 201010, // Qalashi Weapon Diagram
            questId: 70310,
        },
        {
            itemId: 201011, // Spelltouched Tongs
            questId: 70314,
        },
    ],
}
