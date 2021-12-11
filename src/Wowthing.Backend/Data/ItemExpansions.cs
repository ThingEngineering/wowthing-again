using System.Collections.Generic;

namespace Wowthing.Backend.Data
{
    public static partial class Hardcoded
    {
        // sourceItemId -> [itemId1, ..., itemIdN]
        public static readonly Dictionary<int, int[]> ItemExpansions = new()
        {
            // Shadowlands
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
            
            // Mists of Pandaria
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
            { 95823, new[] { 95910, 95933, 95984 } }, // Conqueror Chest [L]
            { 95574, new[] { 95280, 95303, 95328 } }, // Conqueror Chest [N]
            { 96567, new[] { 96654, 96677, 96728 } }, // Conqueror Chest [H]

            { 95824, new[] { 95987, 95945, 95905, 95882 } }, // Protector Chest [L]
            { 95579, new[] { 95331, 95315, 95275, 95255 } }, // Protector Chest [N]
            { 96568, new[] { 96731, 96689, 96649, 96626 } }, // Protector Chest [H]
            
            { 95822, new[] { 95825, 95935, 95835, 95893 } }, // Vanquisher Chest [L]
            { 95569, new[] { 95225, 95305, 95235, 95263 } }, // Vanquisher Chest [N]
            { 96566, new[] { 96569, 96679, 96579, 96637 } }, // Vanquisher Chest [H]
            
            { 95856, new[] { 95930, 95981, 95911 } }, // Conqueror Gloves [L]
            { 95575, new[] { 95300, 95325, 95281 } }, // Conqueror Gloves [N]
            { 96600, new[] { 96674, 96725, 96655 } }, // Conqueror Gloves [H]
            
            { 95857, new[] { 95906, 95988, 95951, 95883 } }, // Protector Gloves [L]
            { 95580, new[] { 95276, 95332, 95321, 95256 } }, // Protector Gloves [N]
            { 96601, new[] { 96650, 96732, 96695, 96627 } }, // Protector Gloves [H]
            
            { 95855, new[] { 95826, 95890, 95845, 95936 } }, // Vanquisher Gloves [L]
            { 95570, new[] { 95226, 95260, 95245, 95306 } }, // Vanquisher Gloves [N]
            { 96599, new[] { 96570, 96634, 96589, 96680 } }, // Vanquisher Gloves [H]
            
            { 95880, new[] { 95926, 95982, 95922 } }, // Conqueror Helm [L]
            { 95577, new[] { 95296, 95326, 95292 } }, // Conqueror Helm [N]
            { 96624, new[] { 96670, 96726, 96666 } }, // Conqueror Helm [H]
            
            { 95881, new[] { 95993, 95942, 95907, 95884 } }, // Protector Helm [L]
            { 95582, new[] { 95337, 95312, 95277, 95257 } }, // Protector Helm [N]
            { 96625, new[] { 96737, 96686, 96651, 96628 } }, // Protector Helm [H]
            
            { 95879, new[] { 95846, 95832, 95891, 95937 } }, // Vanquisher Helm [L]
            { 95571, new[] { 95246, 95232, 95261, 95307 } }, // Vanquisher Helm [N]
            { 96623, new[] { 96590, 96576, 96635, 96681 } }, // Vanquisher Helm [H]
            
            { 95888, new[] { 95932, 95983, 95918 } }, // Conqueror Legs [L]
            { 95576, new[] { 95302, 95327, 95288 } }, // Conqueror Legs [N]
            { 96632, new[] { 96676, 96727, 96662 } }, // Conqueror Legs [H]
            
            { 95889, new[] { 95898, 95953, 95994, 95885 } }, // Protector Legs [L]
            { 95581, new[] { 95268, 95323, 95338, 95258 } }, // Protector Legs [N]
            { 96633, new[] { 96642, 96697, 96738, 96629 } }, // Protector Legs [H]
            
            { 95887, new[] { 95853, 95828, 95892, 95938 } }, // Vanquisher Legs [L]
            { 95572, new[] { 95253, 95228, 95262, 95308 } }, // Vanquisher Legs [N]
            { 96631, new[] { 96597, 96572, 96636, 96682 } }, // Vanquisher Legs [H]
            
            { 95956, new[] { 95919, 95929, 95985 } }, // Conqueror Shoulders [L]
            { 95578, new[] { 95289, 95299, 95329 } }, // Conqueror Shoulders [N]
            { 96700, new[] { 96663, 96673, 96729 } }, // Conqueror Shoulders [H]
            
            { 95957, new[] { 95904, 95944, 95990, 95886 } }, // Protector Shoulders [L]
            { 95583, new[] { 95274, 95314, 95334, 95259 } }, // Protector Shoulders [N]
            { 96701, new[] { 96648, 96688, 96734, 96630 } }, // Protector Shoulders [H]
            
            { 95955, new[] { 95894, 95844, 95939, 95829 } }, // Vanquisher Shoulders [L]
            { 95573, new[] { 95264, 95244, 95309, 95229 } }, // Vanquisher Shoulders [N]
            { 96699, new[] { 96638, 96588, 96683, 96573 } }, // Vanquisher Shoulders [H]
            #endregion
            
            #region Mogu'shan Vaults/Heart of Fear/Terrace of Endless Spring
            { 89265, new[] { 86707, 86712, 86683 } }, // Conqueror Chest [L]
            { 89237, new[] { 85367, 85372, 85343 } }, // Conqueror Chest [N]
            { 89250, new[] { 87122, 87190, 87099 } }, // Conqueror Chest [H]

            { 89266, new[] { 86672, 86628, 86728, 86638 } }, // Protector Chest [L]
            { 89238, new[] { 85332, 85288, 85388, 85298 } }, // Protector Chest [N]
            { 89251, new[] { 87193, 87134, 87094, 87002 } }, // Protector Chest [H]
            
            { 89264, new[] { 86678, 86653, 86715, 86643 } }, // Vanquisher Chest [L]
            { 89239, new[] { 85338, 85313, 85375, 85303 } }, // Vanquisher Chest [N]
            { 89249, new[] { 86913, 86923, 87010, 87124 } }, // Vanquisher Chest [H]
            
            { 89271, new[] { 86704, 86709, 86682 } }, // Conqueror Gloves [L]
            { 89240, new[] { 85364, 85369, 85342 } }, // Conqueror Gloves [N]
            { 89256, new[] { 87119, 87187, 87100 } }, // Conqueror Gloves [H]
            
            { 89272, new[] { 86630, 86671, 86727, 86637 } }, // Protector Gloves [L]
            { 89241, new[] { 85290, 85331, 85387, 85297 } }, // Protector Gloves [N]
            { 89257, new[] { 87140, 87194, 87095, 87003 } }, // Protector Gloves [H]
            
            { 89270, new[] { 86648, 86677, 86718, 86642 } }, // Vanquisher Gloves [L]
            { 89242, new[] { 85308, 85337, 85378, 85302 } }, // Vanquisher Gloves [N]
            { 89255, new[] { 86933, 86914, 87007, 87125 } }, // Vanquisher Gloves [H]
            
            { 89274, new[] { 86702, 86710, 86661 } }, // Conqueror Helm [L]
            { 89235, new[] { 85362, 85370, 85321 } }, // Conqueror Helm [N]
            { 89259, new[] { 87115, 87188, 87111 } }, // Conqueror Helm [H]
            
            { 89275, new[] { 86666, 86691, 86726, 86636 } }, // Protector Helm [L]
            { 89236, new[] { 85326, 85351, 85386, 85296 } }, // Protector Helm [N]
            { 89260, new[] { 87199, 87131, 87096, 87004 } }, // Protector Helm [H]
            
            { 89273, new[] { 86647, 86656, 86641, 86717 } }, // Vanquisher Helm [L]
            { 89234, new[] { 85307, 85316, 85301, 85377 } }, // Vanquisher Helm [N]
            { 89258, new[] { 86934, 86920, 87126, 87008 } }, // Vanquisher Helm [H]
            
            { 89268, new[] { 86706, 86711, 86685 } }, // Conqueror Legs [L]
            { 89243, new[] { 85366, 85371, 85345 } }, // Conqueror Legs [N]
            { 89253, new[] { 87121, 87189, 87107 } }, // Conqueror Legs [H]
            
            { 89269, new[] { 86632, 86665, 86737, 86635 } }, // Protector Legs [L]
            { 89244, new[] { 85292, 85325, 85397, 85295 } }, // Protector Legs [N]
            { 89254, new[] { 87142, 87200, 87087, 87005 } }, // Protector Legs [H]
            
            { 89267, new[] { 86722, 86675, 86716, 86640 } }, // Vanquisher Legs [L]
            { 89245, new[] { 85382, 85335, 85376, 85300 } }, // Vanquisher Legs [N]
            { 89252, new[] { 86941, 86916, 87009, 87127 } }, // Vanquisher Legs [H]
            
            { 89277, new[] { 86699, 86713, 86684 } }, // Conqueror Shoulders [L]
            { 89246, new[] { 85359, 85373, 85344 } }, // Conqueror Shoulders [N]
            { 89262, new[] { 87118, 87191, 87108 } }, // Conqueror Shoulders [H]
            
            { 89278, new[] { 86689, 86669, 86733, 86634 } }, // Protector Shoulders [L]
            { 89247, new[] { 85349, 85329, 85393, 85294 } }, // Protector Shoulders [N]
            { 89263, new[] { 87133, 87196, 87093, 87006 } }, // Protector Shoulders [H]
            
            { 89276, new[] { 86694, 86714, 86674, 86639 } }, // Vanquisher Shoulders [L]
            { 89248, new[] { 85354, 85374, 85334, 85299 } }, // Vanquisher Shoulders [N]
            { 89261, new[] { 86932, 87011, 86917, 87128 } }, // Vanquisher Shoulders [H]
            #endregion
            
            // Cataclysm
            #region Dragon Soul
            #endregion
            
            #region Firelands
            #endregion
            
            #region Bastion of Twilight/Blackwing Descent/Throne of the Four Winds
            #endregion
            
            // Wrath of the Lich King
            #region Icecrown Citadel
            #endregion
            
            #region Trial of the Crusader
            #endregion
            
            #region Ulduar
            #endregion
            
            #region Naxxramas/The Obsidian Sanctum/The Eye of Eternity
            #endregion
            
            // The Burning Crusade
            #region Sunwell Plateau
            { 34856, new[] { 34562, 34564, 34561 } }, // Conqueror Feet
            { 34857, new[] { 34570, 34568, 34565 } }, // Protector Feet
            { 34858, new[] { 34574, 34575, 34571 } }, // Vanquisher Feet

            { 34853, new[] { 34527, 34541, 34487 } }, // Conqueror Waist
            { 34854, new[] { 34549, 34546, 34543 } }, // Protector Waist
            { 34855, new[] { 34557, 34558, 34554 } }, // Vanquisher Waist

            { 34848, new[] { 34434, 34436, 34431 } }, // Conqueror Wrists
            { 34851, new[] { 34443, 34441, 34437 } }, // Protector Wrists
            { 34852, new[] { 34447, 34448, 34446 } }, // Vanquisher Wrists
            #endregion
            
            #region The Battle for Mount Hyjal/Black Temple
            { 31089, new[] { 30990, 31052, 31065 } }, // Conqueror Chest
            { 31091, new[] { 31004, 30975, 31017 } }, // Protector Chest
            { 31090, new[] { 31057, 31028, 31042 } }, // Vanquisher Chest

            { 31092, new[] { 31060, 31050, 30982 } }, // Conqueror Gloves 
            { 31093, new[] { 31055, 31026, 31034 } }, // Protector Gloves
            { 31094, new[] { 31001, 30969, 31008 } }, // Vanquisher Gloves

            { 31097, new[] { 31063, 31051, 30987 } }, // Conqueror Helm 
            { 31096, new[] { 31056, 31027, 31039 } }, // Protector Helm
            { 31095, new[] { 31003, 30972, 31015 } }, // Vanquisher Helm

            { 31098, new[] { 31068, 31053, 30993 } }, // Conqueror Legs 
            { 31100, new[] { 31005, 30977, 31019 } }, // Protector Legs
            { 31099, new[] { 31058, 31029, 31044 } }, // Vanquisher Legs
            
            { 31101, new[] { 30996, 31069, 31054 } }, // Conqueror Shoulders
            { 31103, new[] { 31006, 30979, 31023 } }, // Protector Shoulders
            { 31102, new[] { 31059, 31030, 31048 } }, // Vanquisher Shoulders
            #endregion
            
            #region Serpentshrine Cavern/The Eye
            { 30236, new[] { 30164, 30129, 30144 } }, // Champion Chest 
            { 30237, new[] { 30118, 30216, 30159 } }, // Defender Chest
            { 30238, new[] { 30139, 30214, 30196 } }, // Hero Chest
            
            { 30239, new[] { 30189, 30130, 30145 } }, // Champion Gloves 
            { 30240, new[] { 30119, 30151, 30232 } }, // Defender Gloves
            { 30241, new[] { 30205, 30211, 30140 } }, // Hero Gloves
            
            { 30242, new[] { 30166, 30125, 30146 } }, // Champion Helm 
            { 30243, new[] { 30152, 30120, 30228 } }, // Defender Helm
            { 30244, new[] { 30206, 30212, 30141 } }, // Hero Helm
            
            { 30245, new[] { 30172, 30132, 30148 } }, // Champion Legs 
            { 30246, new[] { 30153, 30121, 30229 } }, // Defender Legs
            { 30247, new[] { 30207, 30213, 30142 } }, // Hero Legs
            
            { 30248, new[] { 30168, 30138, 30149 } }, // Champion Shoulders 
            { 30249, new[] { 30122, 30154, 30230 } }, // Defender Shoulders
            { 30250, new[] { 30210, 30215, 30143 } }, // Hero Shoulders
            #endregion
            
            #region Karazhan/Gruul's Lair/Magtheridon's Lair
            { 29754, new[] { 29038, 29071, 29045 } }, // Champion Chest 
            { 29753, new[] { 29096, 29050, 29019 } }, // Defender Chest
            { 29755, new[] { 29082, 29077, 28964 } }, // Hero Chest
            
            { 29757, new[] { 29039, 29072, 29048 } }, // Champion Gloves 
            { 29758, new[] { 29097, 29057, 29020 } }, // Defender Gloves
            { 29756, new[] { 29085, 29080, 28968 } }, // Hero Gloves
            
            { 29760, new[] { 29035, 29073, 29044 } }, // Champion Helm 
            { 29761, new[] { 29093, 29049, 29021 } }, // Defender Helm
            { 29759, new[] { 29076, 29081, 28963 } }, // Hero Helm
            
            { 29768, new[] { 29030, 29074, 29046 } }, // Champion Legs 
            { 29767, new[] { 29094, 29059, 29022 } }, // Defender Legs
            { 29765, new[] { 29083, 29078, 28966 } }, // Hero Legs
            
            { 29763, new[] { 29037, 29064, 29047 } }, // Champion Shoulders 
            { 29764, new[] { 29054, 29100, 29016 } }, // Defender Shoulders
            { 29762, new[] { 29084, 29079, 28967 } }, // Hero Shoulders
            #endregion
        };
    }
}
