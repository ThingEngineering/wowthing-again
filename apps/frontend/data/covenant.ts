import fromPairs from 'lodash/fromPairs'

import { Covenant } from '@/types'

export const covenantMap: Record<number, Covenant> = {
    1: new Covenant(1, 'Kyrian', 'kyrian', 'covenant_kyrian'),
    2: new Covenant(2, 'Venthyr', 'venthyr', 'covenant_venthyr'),
    3: new Covenant(3, 'Night Fae', 'night-fae', 'covenant_night_fae'),
    4: new Covenant(4, 'Necrolord', 'necrolord', 'covenant_necrolord'),
}

export const covenantOrder: number[] = [
    1, // Kyrian
    4, // Necrolord
    3, // Night Fae
    2, // Venthyr
]

export const covenantNameMap = Object.fromEntries(
    Object.entries(covenantMap).map(([, covenant]) => [covenant.name, covenant])
)

export const covenantSlugMap: Record<string, Covenant> =
    fromPairs(Object.values(covenantMap).map(c => [c.slug, c]))

export const covenantFeatureOrder: [string, string, number][] = [
    ['conductor', 'Anima Conductor', 3],
    ['missions', 'Command Table', 3],
    ['transport', 'Transport Network', 3],
    ['unique', 'Special Feature', 5],
]

export const covenantFeatureReputation: Record<string, number> = {
    '2-unique': 2445, // The Ember Court
    '3-conductor': 2464, // Court of Night
    '3-transport': 2463, // Marasmius
    '4-unique': 2462, // Stitchmasters
}

export const covenantFeatureCost: Record<number, number[][]> = {
    1: [
        [1, 1000],
        [8, 5000],
        [22, 10000],
    ],
    2: [
        [1, 1000],
        [8, 5000],
        [22, 10000],
    ],
    3: [
        [1, 1000],
        [8, 5000],
        [22, 10000],
    ],
    4: [
        [6, 1500],
        [12, 5000],
        [22, 10000],
        [40, 12500],
        [70, 15000],
    ],
}

// Necrolords
// [criteriaId, spellId]
export const abominations: [number, number][] = [
    [88203, 325454], // Atticus
    [88196, 325284], // Chordy
    [88201, 325453], // Flytrap
    [88208, 326380], // Gas Bag
    [88209, 338039], // Guillotine
    [88212, 338037], // Iron Phillip
    [88210, 326408], // Mama Tomalin
    [88202, 325452], // Marz
    [88213, 325458], // Miru
    [88211, 338043], // Naxx
    [88214, 326379], // Neena
    [88207, 326406], // Professor
    [88204, 325451], // Roseboil
    [88205, 338040], // Sabrina
    [88206, 326407], // Toothpick
    [88215, 343436], // Unity
]

// Night Fae
// [spellId, icon]
export const soulshapes: [number, string][] = [
    [65010, 'item/187882'], // Alpaca
    [62422, 'item/182165'], // Ardenmoth
    [65509, 'item/189977'], // Bat
    [65025, 'item/187905'], // Boar
    [65510, 'item/189980'], // Brutosaur
    [65640, 'item/190337'], // Cervid
    [65024, 'item/187904'], // Cloud Serpent
    [64651, 'item/182167'], // Cobra
    [62424, 'item/182168'], // Crane
    [63607, 'item/185051'], // Direhorn
    [65504, 'item/189971'], // Dragonhawk
    [65021, 'item/187901'], // Eagle
    [65507, 'item/189975'], // Elekk
    [62428, 'item/182172'], // Equine
    [65008, 'item/187880'], // Goat
    [62426, 'item/182170'], // Gryphon
    [62421, 'item/181314'], // Gulper
    [63608, 'item/185052'], // Hippo
    [62427, 'item/182171'], // Hippogryph
    [64650, 'item/182173'], // Hyena
    [65023, 'item/187903'], // Jormungar
    [63609, 'item/185053'], // Kodo
    [62429, 'item/182174'], // Leonine
    [62438, 'item/182182'], // Lupine
    [63610, 'item/185054'], // Mammoth
    [62430, 'item/182175'], // Moose
    [65026, 'item/187906'], // Owl
    [62432, 'item/182177'], // Owlcat
    [65009, 'item/187881'], // Ram
    [62433, 'item/182178'], // Raptor
    [65506, 'item/189973'], // Ray
    [62434, 'item/182179'], // Runestag
    [63605, 'item/185049'], // Saurolisk
    [65505, 'item/189972'], // Scorpid
    [62431, 'item/182176'], // Shadowstalker
    [63604, 'item/185048'], // Shoveltusk
    [62436, 'item/182185'], // Shrieker
    [65512, 'item/189982'], // Silithid
    [62420, 'item/181313'], // Snapper
    [63606, 'item/185050'], // Spider
    [65022, 'item/187902'], // Sporebat
    [62435, 'item/182180'], // Stag
    [65508, 'item/189976'], // Tallstrider
    [62437, 'item/182181'], // Tiger
    [62423, 'item/182166'], // Ursine
    [62425, 'item/182169'], // Veilwing
    //[0, 'item/0'], // Vulpin
    [62439, 'item/182183'], // Wolfhawk
    [62440, 'item/182184'], // Wyvern
    [63603, 'item/185047'], // Yak
]

// [spellId, icon]
export const crittershapes: [number, string][] = [
    [65514, 'item/189986'], // Armadillo
    [65518, 'item/189990'], // Bee
    [64984, 'item/187858'], // Bunny
    [64961, 'item/187819'], // Cat
    [64982, 'item/155858'], // Cat (Well Fed)
    [64941, 'item/187813'], // Chicken
    [64938, 'item/158149'], // Corgi
    [64990, 'item/187871'], // Cricket
    [64994, 'item/187877'], // Frog
    [65513, 'item/189983'], // Gromit
    [64959, 'item/187818'], // Otter
    [65517, 'item/189989'], // Penguin
    [65515, 'item/189987'], // Pig
    [64989, 'item/187870'], // Porcupine
    [64992, 'item/187873'], // Prairie Dog
    [64985, 'item/187859'], // Rat
    [64995, 'item/187878'], // Saurid
    [64993, 'item/187876'], // Saurolisk Hatchling
    [65516, 'item/189988'], // Sheep
    [65519, 'item/189991'], // Snail
    [64988, 'item/187862'], // Snake
    [65467, 'item/189705'], // Turkey
]
