using System.Collections.Generic;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        // sourceItemId -> [itemId1, ..., itemIdN]
        public static readonly Dictionary<int, int[]> ItemExpansions = new()
        {
            //{ , new[] { } }, // 
            
            #region Castle Nathria
            {
                183893, // Abominable Anima Spherule (Sun King)
                new[]
                {
                    184253, // Abdomen Chopper
                    184252, // Aranakk Torture Device
                    184272, // Ascended Gladius of Glory
                    179544, // Ashcarved Sledgehammer
                    182421, // Barbed-Edge of the Stone Legion
                    179557, // Baron's Oaken Scepter
                    184244, // Biting Gutsliver Shank
                    184248, // Blightforged Twinblade
                    182416, // Claws of the Stone Generals
                    182414, // Crimson Court Backstabber
                    184250, // Deadeye Blunderbuss
                    180260, // Deathdancer's Warglaive
                    182422, // Dread Inquisitor's Spine
                    182424, // Dredbat Repeating Crossbow
                    174298, // Dutiful Disciple's Cleaver
                    179497, // Fang of the Winged Sentry
                    175251, // Forked Blade of Fortitude
                    179527, // Gargon-Tamer's Spear
                    184247, // Grip of the Dead
                    184255, // Gristlegore Hacker
                    180312, // Guarding Cudgel of the Goliath
                    180073, // Heartstalker's Longbow
                    175279, // Lost Soul Xiphos
                    182417, // Mace of Enveloping Sins
                    182351, // Mace of the Unburdened
                    177850, // Meditation's Muse
                    182420, // Nathrian Duelist's Fleshrender
                    182419, // Nathrian Torchbearer's Stave
                    184251, // Ossified Broadaxe
                    184230, // Pike of the Honored Peltast
                    184254, // Plaguespine Sickle
                    184273, // Puremind Piercer
                    184275, // Sacred Sparrer's Edge
                    184249, // Staff of the Lichsworn Lieutenant
                    180000, // Staff of the Penitent
                    182415, // Stoneborn Goliath's Cleaver
                    179577, // Stonesnap Mandibles
                    178973, // Symphonic Chimekeeper
                    182418, // Torch of Fiery Atonement
                    176098, // Truthseeker Longbow
                    180023, // Wand of Arboreal Artifice
                    184236, // Warglaive of Devoted Might
                    182423, // Wingdancer's Warglaive
                }
            },
            {
                183896, // Abominable Anima Spherule (Sire Denathrius)
                new[]
                {
                    184265, // Abdomen Splitter
                    177872, // Archon's Guiding Glaive
                    179541, // Colossal Sludgepounder
                    184262, // Deadeye Cannon
                    184270, // Disciple's Peacebound Poniard
                    182398, // Dredfang Ironspitter
                    182394, // Dredwing Barbed Swordbreaker
                    180258, // Faeweald Fleshrender
                    177865, // Faithful Sidearm
                    184266, // Fleshscourge Sickle
                    184259, // Grasp from the Grave
                    184261, // Greatstaff of the Lichsworn General
                    182396, // Hungering Ritualist's Animablade
                    179579, // Jaws of the Hungerer
                    179492, // Keepcrawler's Gutripper
                    184264, // Krexus's Bloodletting Polearm
                    174302, // Labrys of the Loyal Larion
                    182397, // Legion General's Glaivewing
                    182388, // Nathrian Assassin's Backbiter
                    182389, // Nathrian Crusader's Bastard Sword
                    179530, // Nightwatch Eviscerator
                    184263, // Ossified Greataxe
                    180315, // Polemarch's Scepter of Faith
                    184243, // Praetorian Wingblade
                    184274, // Reaver of Renewed Resolve
                    182393, // Rod of the Stone Sentinels
                    180022, // Rootbulb of the Sinless
                    179561, // Rootspinner's Bloodbough
                    180071, // Shrieking Sinseeker
                    177860, // Silvered Recurve of Reconciliation
                    182392, // Sinbearer's Absolution Staff
                    182391, // Sinstealer's Sentencing Gavel
                    184267, // Skullcleaver of the Merciless One
                    177849, // Soulbearer's Blade of Salvation
                    177855, // Spellblade of Antiquity
                    180002, // Spire of the Long Dark
                    184241, // Stone-Sentinel Breaker
                    182395, // Stoneborn Terrorblade
                    182390, // Talons of the Legion Generals
                    178975, // Vesiphone's Vesper of Reflection
                    184256, // Vicious Goreripper Shank
                    184260, // Warglaive of the Hidden Fiend
                    184271, // Xandria's Kopis of Courage
                }
            },
            {
                183892, // Mystic Anima Spherule (Huntsman Altimor)
                new[]
                {
                    184253, // Abdomen Chopper
                    184252, // Aranakk Torture Device
                    184272, // Ascended Gladius of Glory
                    179544, // Ashcarved Sledgehammer
                    182421, // Barbed-Edge of the Stone Legion
                    179557, // Baron's Oaken Scepter
                    184244, // Biting Gutsliver Shank
                    184248, // Blightforged Twinblade
                    182416, // Claws of the Stone Generals
                    182414, // Crimson Court Backstabber
                    184250, // Deadeye Blunderbuss
                    180260, // Deathdancer's Warglaive
                    182422, // Dread Inquisitor's Spine
                    182424, // Dredbat Repeating Crossbow
                    174298, // Dutiful Disciple's Cleaver
                    179497, // Fang of the Winged Sentry
                    175251, // Forked Blade of Fortitude
                    179527, // Gargon-Tamer's Spear
                    184247, // Grip of the Dead
                    184255, // Gristlegore Hacker
                    180312, // Guarding Cudgel of the Goliath
                    180073, // Heartstalker's Longbow
                    175279, // Lost Soul Xiphos
                    182417, // Mace of Enveloping Sins
                    182351, // Mace of the Unburdened
                    177850, // Meditation's Muse
                    182420, // Nathrian Duelist's Fleshrender
                    182419, // Nathrian Torchbearer's Stave
                    184251, // Ossified Broadaxe
                    184230, // Pike of the Honored Peltast
                    184254, // Plaguespine Sickle
                    184273, // Puremind Piercer
                    184275, // Sacred Sparrer's Edge
                    184249, // Staff of the Lichsworn Lieutenant
                    180000, // Staff of the Penitent
                    182415, // Stoneborn Goliath's Cleaver
                    179577, // Stonesnap Mandibles
                    178973, // Symphonic Chimekeeper
                    182418, // Torch of Fiery Atonement
                    176098, // Truthseeker Longbow
                    180023, // Wand of Arboreal Artifice
                    184236, // Warglaive of Devoted Might
                    182423, // Wingdancer's Warglaive
                }
            },
            {
                183897, // Mystic Anima Spherule (Sire Denathrius)
                new[]
                {
                    184265, // Abdomen Splitter
                    177872, // Archon's Guiding Glaive
                    179541, // Colossal Sludgepounder
                    184262, // Deadeye Cannon
                    184270, // Disciple's Peacebound Poniard
                    182398, // Dredfang Ironspitter
                    182394, // Dredwing Barbed Swordbreaker
                    180258, // Faeweald Fleshrender
                    177865, // Faithful Sidearm
                    184266, // Fleshscourge Sickle
                    184259, // Grasp from the Grave
                    184261, // Greatstaff of the Lichsworn General
                    182396, // Hungering Ritualist's Animablade
                    179579, // Jaws of the Hungerer
                    179492, // Keepcrawler's Gutripper
                    184264, // Krexus's Bloodletting Polearm
                    174302, // Labrys of the Loyal Larion
                    182397, // Legion General's Glaivewing
                    182388, // Nathrian Assassin's Backbiter
                    182389, // Nathrian Crusader's Bastard Sword
                    179530, // Nightwatch Eviscerator
                    184263, // Ossified Greataxe
                    180315, // Polemarch's Scepter of Faith
                    184243, // Praetorian Wingblade
                    184274, // Reaver of Renewed Resolve
                    182393, // Rod of the Stone Sentinels
                    180022, // Rootbulb of the Sinless
                    179561, // Rootspinner's Bloodbough
                    180071, // Shrieking Sinseeker
                    177860, // Silvered Recurve of Reconciliation
                    182392, // Sinbearer's Absolution Staff
                    182391, // Sinstealer's Sentencing Gavel
                    184267, // Skullcleaver of the Merciless One
                    177849, // Soulbearer's Blade of Salvation
                    177855, // Spellblade of Antiquity
                    180002, // Spire of the Long Dark
                    184241, // Stone-Sentinel Breaker
                    182395, // Stoneborn Terrorblade
                    182390, // Talons of the Legion Generals
                    178975, // Vesiphone's Vesper of Reflection
                    184256, // Vicious Goreripper Shank
                    184260, // Warglaive of the Hidden Fiend
                    184271, // Xandria's Kopis of Courage
                }
            },
            {
                183891, // Venerated Anima Spherule (Hungering Destroyer)
                new[]
                {
                    184253, // Abdomen Chopper
                    184252, // Aranakk Torture Device
                    184272, // Ascended Gladius of Glory
                    179544, // Ashcarved Sledgehammer
                    182421, // Barbed-Edge of the Stone Legion
                    179557, // Baron's Oaken Scepter
                    184244, // Biting Gutsliver Shank
                    184248, // Blightforged Twinblade
                    182416, // Claws of the Stone Generals
                    182414, // Crimson Court Backstabber
                    184250, // Deadeye Blunderbuss
                    180260, // Deathdancer's Warglaive
                    182422, // Dread Inquisitor's Spine
                    182424, // Dredbat Repeating Crossbow
                    174298, // Dutiful Disciple's Cleaver
                    179497, // Fang of the Winged Sentry
                    175251, // Forked Blade of Fortitude
                    179527, // Gargon-Tamer's Spear
                    184247, // Grip of the Dead
                    184255, // Gristlegore Hacker
                    180312, // Guarding Cudgel of the Goliath
                    180073, // Heartstalker's Longbow
                    175279, // Lost Soul Xiphos
                    182417, // Mace of Enveloping Sins
                    182351, // Mace of the Unburdened
                    177850, // Meditation's Muse
                    182420, // Nathrian Duelist's Fleshrender
                    182419, // Nathrian Torchbearer's Stave
                    184251, // Ossified Broadaxe
                    184230, // Pike of the Honored Peltast
                    184254, // Plaguespine Sickle
                    184273, // Puremind Piercer
                    184275, // Sacred Sparrer's Edge
                    184249, // Staff of the Lichsworn Lieutenant
                    180000, // Staff of the Penitent
                    182415, // Stoneborn Goliath's Cleaver
                    179577, // Stonesnap Mandibles
                    178973, // Symphonic Chimekeeper
                    182418, // Torch of Fiery Atonement
                    176098, // Truthseeker Longbow
                    180023, // Wand of Arboreal Artifice
                    184236, // Warglaive of Devoted Might
                    182423, // Wingdancer's Warglaive
                }
            },
            {
                183898, // Venerated Anima Spherule (Sire Denathrius)
                new[]
                {
                    184265, // Abdomen Splitter
                    177872, // Archon's Guiding Glaive
                    179541, // Colossal Sludgepounder
                    184262, // Deadeye Cannon
                    184270, // Disciple's Peacebound Poniard
                    182398, // Dredfang Ironspitter
                    182394, // Dredwing Barbed Swordbreaker
                    180258, // Faeweald Fleshrender
                    177865, // Faithful Sidearm
                    184266, // Fleshscourge Sickle
                    184259, // Grasp from the Grave
                    184261, // Greatstaff of the Lichsworn General
                    182396, // Hungering Ritualist's Animablade
                    179579, // Jaws of the Hungerer
                    179492, // Keepcrawler's Gutripper
                    184264, // Krexus's Bloodletting Polearm
                    174302, // Labrys of the Loyal Larion
                    182397, // Legion General's Glaivewing
                    182388, // Nathrian Assassin's Backbiter
                    182389, // Nathrian Crusader's Bastard Sword
                    179530, // Nightwatch Eviscerator
                    184263, // Ossified Greataxe
                    180315, // Polemarch's Scepter of Faith
                    184243, // Praetorian Wingblade
                    184274, // Reaver of Renewed Resolve
                    182393, // Rod of the Stone Sentinels
                    180022, // Rootbulb of the Sinless
                    179561, // Rootspinner's Bloodbough
                    180071, // Shrieking Sinseeker
                    177860, // Silvered Recurve of Reconciliation
                    182392, // Sinbearer's Absolution Staff
                    182391, // Sinstealer's Sentencing Gavel
                    184267, // Skullcleaver of the Merciless One
                    177849, // Soulbearer's Blade of Salvation
                    177855, // Spellblade of Antiquity
                    180002, // Spire of the Long Dark
                    184241, // Stone-Sentinel Breaker
                    182395, // Stoneborn Terrorblade
                    182390, // Talons of the Legion Generals
                    178975, // Vesiphone's Vesper of Reflection
                    184256, // Vicious Goreripper Shank
                    184260, // Warglaive of the Hidden Fiend
                    184271, // Xandria's Kopis of Courage
                }
            },
            {
                183890, // Zenith Anima Spherule (The Council of Blood)
                new[]
                {
                    184253, // Abdomen Chopper
                    184252, // Aranakk Torture Device
                    184272, // Ascended Gladius of Glory
                    179544, // Ashcarved Sledgehammer
                    182421, // Barbed-Edge of the Stone Legion
                    179557, // Baron's Oaken Scepter
                    184244, // Biting Gutsliver Shank
                    184248, // Blightforged Twinblade
                    182416, // Claws of the Stone Generals
                    182414, // Crimson Court Backstabber
                    184250, // Deadeye Blunderbuss
                    180260, // Deathdancer's Warglaive
                    182422, // Dread Inquisitor's Spine
                    182424, // Dredbat Repeating Crossbow
                    174298, // Dutiful Disciple's Cleaver
                    179497, // Fang of the Winged Sentry
                    175251, // Forked Blade of Fortitude
                    179527, // Gargon-Tamer's Spear
                    184247, // Grip of the Dead
                    184255, // Gristlegore Hacker
                    180312, // Guarding Cudgel of the Goliath
                    180073, // Heartstalker's Longbow
                    175279, // Lost Soul Xiphos
                    182417, // Mace of Enveloping Sins
                    182351, // Mace of the Unburdened
                    177850, // Meditation's Muse
                    182420, // Nathrian Duelist's Fleshrender
                    182419, // Nathrian Torchbearer's Stave
                    184251, // Ossified Broadaxe
                    184230, // Pike of the Honored Peltast
                    184254, // Plaguespine Sickle
                    184273, // Puremind Piercer
                    184275, // Sacred Sparrer's Edge
                    184249, // Staff of the Lichsworn Lieutenant
                    180000, // Staff of the Penitent
                    182415, // Stoneborn Goliath's Cleaver
                    179577, // Stonesnap Mandibles
                    178973, // Symphonic Chimekeeper
                    182418, // Torch of Fiery Atonement
                    176098, // Truthseeker Longbow
                    180023, // Wand of Arboreal Artifice
                    184236, // Warglaive of Devoted Might
                    182423, // Wingdancer's Warglaive
                }
            },
            {
                183899, // Zenith Anima Spherule (Sire Denathrius)
                new[]
                {
                    184265, // Abdomen Splitter
                    177872, // Archon's Guiding Glaive
                    179541, // Colossal Sludgepounder
                    184262, // Deadeye Cannon
                    184270, // Disciple's Peacebound Poniard
                    182398, // Dredfang Ironspitter
                    182394, // Dredwing Barbed Swordbreaker
                    180258, // Faeweald Fleshrender
                    177865, // Faithful Sidearm
                    184266, // Fleshscourge Sickle
                    184259, // Grasp from the Grave
                    184261, // Greatstaff of the Lichsworn General
                    182396, // Hungering Ritualist's Animablade
                    179579, // Jaws of the Hungerer
                    179492, // Keepcrawler's Gutripper
                    184264, // Krexus's Bloodletting Polearm
                    174302, // Labrys of the Loyal Larion
                    182397, // Legion General's Glaivewing
                    182388, // Nathrian Assassin's Backbiter
                    182389, // Nathrian Crusader's Bastard Sword
                    179530, // Nightwatch Eviscerator
                    184263, // Ossified Greataxe
                    180315, // Polemarch's Scepter of Faith
                    184243, // Praetorian Wingblade
                    184274, // Reaver of Renewed Resolve
                    182393, // Rod of the Stone Sentinels
                    180022, // Rootbulb of the Sinless
                    179561, // Rootspinner's Bloodbough
                    180071, // Shrieking Sinseeker
                    177860, // Silvered Recurve of Reconciliation
                    182392, // Sinbearer's Absolution Staff
                    182391, // Sinstealer's Sentencing Gavel
                    184267, // Skullcleaver of the Merciless One
                    177849, // Soulbearer's Blade of Salvation
                    177855, // Spellblade of Antiquity
                    180002, // Spire of the Long Dark
                    184241, // Stone-Sentinel Breaker
                    182395, // Stoneborn Terrorblade
                    182390, // Talons of the Legion Generals
                    178975, // Vesiphone's Vesper of Reflection
                    184256, // Vicious Goreripper Shank
                    184260, // Warglaive of the Hidden Fiend
                    184271, // Xandria's Kopis of Courage
                }
            },
            {
                183888, // Apogee Anima Bead (Artificer Xy'mox)
                new[]
                {
                    184245, // Barrier of the Chosen
                    182425, // Bulwark of the Stone Legion
                    175254, // Burning Beacon of Hope
                    179610, // Dredge-Giant's Warshield
                    174310, // Elysian Sentinel's Aegis
                    184246, // Frigid Invoker's Focus
                    179570, // Harp of the Sanguine Court
                    182426, // Stonewright's Infused Stonecarver
                }
            },
            {
                183895, // Apogee Anima Bead (Stone Legion Generals)
                new[]
                {
                    179611, // Bulwark of the Unbowed
                    184257, // Burden of the Protectorate
                    174315, // Chyrus's Crest of Hope
                    179566, // Lyre of Decadent Frivolity
                    184258, // Malevolent Invoker's Crystal
                    182400, // Master Stonewright's Chisel
                    182399, // Stonewrought Gargoyles Barrier
                    177870, // Thenios's Beacon of Foresight
                }
            },
            {
                183889, // Thaumaturgic Anima Bead (Lady Inerva Darkvein)
                new[]
                {
                    184245, // Barrier of the Chosen
                    182425, // Bulwark of the Stone Legion
                    175254, // Burning Beacon of Hope
                    179610, // Dredge-Giant's Warshield
                    174310, // Elysian Sentinel's Aegis
                    184246, // Frigid Invoker's Focus
                    179570, // Harp of the Sanguine Court
                    182426, // Stonewright's Infused Stonecarver
                }
            },
            {
                183894, // Thaumaturgic Anima Bead (Stone Legion Generals)
                new[]
                {
                    179611, // Bulwark of the Unbowed
                    184257, // Burden of the Protectorate
                    174315, // Chyrus's Crest of Hope
                    179566, // Lyre of Decadent Frivolity
                    184258, // Malevolent Invoker's Crystal
                    182400, // Master Stonewright's Chisel
                    182399, // Stonewrought Gargoyles Barrier
                    177870, // Thenios's Beacon of Foresight
                }
            },
            #endregion // Castle Nathria
            
            #region Siege of Orgrimmar
            { 99678, new[] { 99052, 99004, 99056 } }, // Conqueror Chest [L]
            { 99743, new[] { 99566, 99627, 99570 } }, // Conqueror Chest [N]
            { 99686, new[] { 99136, 99110, 99204 } }, // Conqueror Chest [H]
            { 99715, new[] { 99387, 99362, 99416 } }, // Conqueror Chest [M]

            { 99679, new[] { 99063, 98992, 99085, 99047 } }, // Protector Chest [L]
            { 99744, new[] { 99643, 99615, 99577, 99603 } }, // Protector Chest [N]
            { 99691, new[] { 99140, 99101, 99167, 99197 } }, // Protector Chest [H]
            { 99716, new[] { 99382, 99347, 99405, 99411 } }, // Protector Chest [M]
            
            { 99677, new[] { 99078, 99041, 99006, 99066 } }, // Vanquisher Chest [L]
            { 99742, new[] { 99658, 99632, 99629, 99608 } }, // Vanquisher Chest [N]
            { 99696, new[] { 99152, 99180, 99112, 99192 } }, // Vanquisher Chest [H]
            { 99714, new[] { 99400, 99326, 99356, 99335 } }, // Vanquisher Chest [M]
            
            { 99681, new[] { 99053, 99019, 99002 } }, // Conqueror Gloves [L]
            { 99746, new[] { 99567, 99586, 99625 } }, // Conqueror Gloves [N]
            { 99687, new[] { 99096, 99121, 99137 } }, // Conqueror Gloves [H]
            { 99721, new[] { 99424, 99359, 99380 } }, // Conqueror Gloves [M]
            
            { 99667, new[] { 99064, 99088, 99086, 99034 } }, // Protector Gloves [L]
            { 99747, new[] { 99644, 99580, 99578, 99559 } }, // Protector Gloves [N]
            { 99692, new[] { 99141, 99092, 99168, 99198 } }, // Protector Gloves [H]
            { 99722, new[] { 99383, 99345, 99406, 99412 } }, // Protector Gloves [M]
            
            { 99680, new[] { 99083, 99007, 98994, 99067 } }, // Vanquisher Gloves [L]
            { 99745, new[] { 99575, 99630, 99617, 99609 } }, // Vanquisher Gloves [N]
            { 99682, new[] { 99160, 99113, 99174, 99193 } }, // Vanquisher Gloves [H]
            { 99720, new[] { 99397, 99355, 99432, 99336 } }, // Vanquisher Gloves [M]
            
            { 99672, new[] { 99024, 99029, 99054 } }, // Conqueror Helm [L]
            { 99749, new[] { 99591, 99596, 99568 } }, // Conqueror Helm [N]
            { 99689, new[] { 99117, 99128, 99097 } }, // Conqueror Helm [H]
            { 99724, new[] { 99366, 99370, 99425 } }, // Conqueror Helm [M]
            
            { 99673, new[] { 99065, 98989, 99032, 99080 } }, // Protector Helm [L]
            { 99750, new[] { 99607, 99612, 99557, 99660 } }, // Protector Helm [N]
            { 99694, new[] { 99142, 99109, 99203, 99157 } }, // Protector Helm [H]
            { 99725, new[] { 99384, 99353, 99409, 99402 } }, // Protector Helm [M]
            
            { 99671, new[] { 99084, 98995, 99049, 99008 } }, // Vanquisher Helm [L]
            { 99748, new[] { 99576, 99618, 99605, 99631 } }, // Vanquisher Helm [N]
            { 99683, new[] { 99161, 99175, 99190, 99114 } }, // Vanquisher Helm [H]
            { 99723, new[] { 99398, 99433, 99323, 99348 } }, // Vanquisher Helm [M]
            
            { 99675, new[] { 98980, 99055, 99021 } }, // Conqueror Legs [L]
            { 99752, new[] { 99666, 99569, 99588 } }, // Conqueror Legs [N]
            { 99688, new[] { 99124, 99098, 99123 } }, // Conqueror Legs [H]
            { 99712, new[] { 99377, 99426, 99361 } }, // Conqueror Legs [M]
            
            { 99676, new[] { 99090, 99074, 99033, 99081 } }, // Protector Legs [L]
            { 99753, new[] { 99646, 99654, 99558, 99573 } }, // Protector Legs [N]
            { 99693, new[] { 99094, 99145, 99195, 99158 } }, // Protector Legs [H]
            { 99713, new[] { 99333, 99394, 99410, 99403 } }, // Protector Legs [M]
            
            { 99674, new[] { 98981, 99077, 99058, 99009 } }, // Vanquisher Legs [L]
            { 99751, new[] { 99610, 99657, 99572, 99634 } }, // Vanquisher Legs [N]
            { 99684, new[] { 99165, 99162, 99186, 99115 } }, // Vanquisher Legs [H]
            { 99726, new[] { 99422, 99399, 99338, 99349 } }, // Vanquisher Legs [M]
            
            { 99669, new[] { 99076, 99045, 99018 } }, // Conqueror Shoulders [L]
            { 99755, new[] { 99656, 99601, 99585 } }, // Conqueror Shoulders [N]
            { 99690, new[] { 99125, 99205, 99120 } }, // Conqueror Shoulders [H]
            { 99718, new[] { 99378, 99417, 99358 } }, // Conqueror Shoulders [M]
            
            { 99670, new[] { 98991, 99062, 99036, 99082 } }, // Protector Shoulders [L]
            { 99756, new[] { 99614, 99642, 99561, 99574 } }, // Protector Shoulders [N]
            { 99695, new[] { 99100, 99151, 99200, 99159 } }, // Protector Shoulders [H]
            { 99719, new[] { 99346, 99381, 99414, 99404 } }, // Protector Shoulders [M]
            
            { 99668, new[] { 99079, 99016, 99059, 99010 } }, // Vanquisher Shoulders [L]
            { 99754, new[] { 99659, 99583, 99639, 99635 } }, // Vanquisher Shoulders [N]
            { 99685, new[] { 99153, 99173, 99187, 99116 } }, // Vanquisher Shoulders [H]
            { 99717, new[] { 99401, 99431, 99339, 99350 } }, // Vanquisher Shoulders [M]
            #endregion
            
            #region Throne of Thunder
            #endregion
            
            #region Mogu'shan Vaults/Heart of Fear/Terrace of Endless Spring
            #endregion
            
            #region Dragon Soul
            #endregion
            
            #region Firelands
            #endregion
            
            #region Bastion of Twilight/Blackwing Descent/Throne of the Four Winds
            #endregion
            
            #region Icecrown Citadel
            #endregion
            
            #region Trial of the Crusader
            #endregion
            
            #region Ulduar
            #endregion
            
            #region Naxxramas/The Obsidian Sanctum/The Eye of Eternity
            #endregion
            
            #region Sunwell Plateau
            #endregion
            
            #region The Battle for Mount Hyjal/Black Temple
            #endregion
            
            #region Serpentshrine Cavern/The Eye
            #endregion
            
            #region Karazhan/Gruul's Lair/Magtheridon's Lair
            #endregion
        };
    }
}
