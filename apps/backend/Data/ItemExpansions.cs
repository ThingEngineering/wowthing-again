namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    // sourceItemId -> [itemId1, ..., itemIdN]
    public static readonly Dictionary<int, int[]> ItemExpansions = new()
    {
        // Shadowlands
        #region Sepulcher of the First Ones
        { 191010, new[] { 188864, 188894, 188884 }}, // Dreadful Chest Module (Death Knight, Demon Hunter, Warlock)
        { 191014, new[] { 188863, 188898, 188890 }}, // Dreadful Hand Module (Death Knight, Demon Hunter, Warlock)
        { 191005, new[] { 188868, 188892, 188889 }}, // Dreadful Helm Module (Death Knight, Demon Hunter, Warlock)
        { 191018, new[] { 188866, 188893, 188887 }}, // Dreadful Leg Module (Death Knight, Demon Hunter, Warlock)
        { 191006, new[] { 188867, 188896, 188888 }}, // Dreadful Shoulder Module (Death Knight, Demon Hunter, Warlock)

        { 191011, new[] { 188849, 188858, 188839 }}, // Mystic Chest Module (Druid, Hunter, Mage)
        { 191015, new[] { 188853, 188861, 188845 }}, // Mystic Hand Module (Druid, Hunter, Mage)
        { 191002, new[] { 188847, 188859, 188844 }}, // Mystic Helm Module (Druid, Hunter, Mage)
        { 191019, new[] { 188848, 188860, 188842 }}, // Mystic Leg Module (Druid, Hunter, Mage)
        { 191007, new[] { 188851, 188856, 188843 }}, // Mystic Shoulder Module (Druid, Hunter, Mage)
            
        { 191012, new[] { 188929, 188875, 188922 }}, // Venerated Chest Module (Paladin, Priest, Shaman)
        { 191016, new[] { 188928, 188881, 188925 }}, // Venerated Hand Module (Paladin, Priest, Shaman)
        { 191003, new[] { 188933, 188880, 188923 }}, // Venerated Helm Module (Paladin, Priest, Shaman)
        { 191020, new[] { 188931, 188878, 188924 }}, // Venerated Leg Module (Paladin, Priest, Shaman)
        { 191008, new[] { 188932, 188879, 188920 }}, // Venerated Shoulder Module (Paladin, Priest, Shaman)
            
        { 191013, new[] { 188912, 188903, 188938 }}, // Zenith Chest Module (Monk, Rogue, Warrior)
        { 191017, new[] { 188916, 188907, 188937 }}, // Zenith Hand Module (Monk, Rogue, Warrior)
        { 191004, new[] { 188910, 188901, 188942 }}, // Zenith Helm Module (Monk, Rogue, Warrior)
        { 191021, new[] { 188911, 188902, 188940 }}, // Zenith Leg Module (Monk, Rogue, Warrior)
        { 191009, new[] { 188914, 188905, 188941 }}, // Zenith Shoulder Module (Monk, Rogue, Warrior)
        #endregion
            
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
        #region Dragon Soul ALL
        { 78863, new[] { 78822, 78821, 78827, 78823, 78826, 78825 } }, // Conqueror Chest [L]
        { 78184, new[] { 76874, 76765, 77003, 76345, 76360, 76340 } }, // Conqueror Chest [N]
        { 78847, new[] { 78727, 78726, 78732, 78728, 78731, 78730 } }, // Conqueror Chest [H]
            
        { 78864, new[] { 78752, 78753, 78819, 78818, 78820, 78756 } }, // Protector Chest [L]
        { 78179, new[] { 76984, 76988, 77040, 77039, 76756, 77028 } }, // Protector Chest [N]
        { 78848, new[] { 78657, 78658, 78724, 78723, 78725, 78661 } }, // Protector Chest [H]

        { 78862, new[] { 78759, 78760, 78755, 78757, 78754, 78758, 78824 } }, // Vanquisher Chest [L]
        { 78174, new[] { 77023, 77013, 76752, 77021, 76974, 77008, 76215 } }, // Vanquisher Chest [N]
        { 78849, new[] { 78664, 78665, 78660, 78662, 78659, 78663, 78729 } }, // Vanquisher Chest [H]

        { 78866, new[] { 78770, 78777, 78768, 78776, 78772, 78778 } }, // Conqueror Gloves [L]
        { 78183, new[] { 76875, 76348, 76766, 76343, 77004, 76357 } }, // Conqueror Gloves [N]
        { 78853, new[] { 78675, 78682, 78673, 78681, 78677, 78683 } }, // Conqueror Gloves [H]
            
        { 78867, new[] { 78763, 78764, 78761, 78762, 78767, 78769 } }, // Protector Gloves [L]
        { 78178, new[] { 76985, 76989, 77038, 77041, 76757, 77029 } }, // Protector Gloves [N]
        { 78854, new[] { 78668, 78669, 78666, 78667, 78672, 78674 } }, // Protector Gloves [H]

        { 78865, new[] { 78774, 78771, 78779, 78775, 78765, 78773, 78766 } }, // Vanquisher Gloves [L]
        { 78173, new[] { 77024, 77018, 77014, 76749, 76975, 77009, 76212 } }, // Vanquisher Gloves [N]
        { 78855, new[] { 78679, 78676, 78684, 78680, 78670, 78678, 78671 } }, // Vanquisher Gloves [H]

        { 78869, new[] { 78795, 78790, 78787, 78788, 78798, 78797 } }, // Conqueror Helm [L]
        { 78182, new[] { 76358, 77005, 76767, 76876, 76347, 76342 } }, // Conqueror Helm [N]
        { 78850, new[] { 78700, 78695, 78692, 78693, 78703, 78702 } }, // Conqueror Helm [H]
            
        { 78870, new[] { 78784, 78783, 78786, 78780, 78781, 78793 } }, // Protector Helm [L]
        { 78177, new[] { 76990, 76983, 76758, 77037, 77042, 77030 } }, // Protector Helm [N]
        { 78851, new[] { 78689, 78688, 78691, 78685, 78686, 78698 } }, // Protector Helm [H]

        { 78868, new[] { 78794, 78791, 78789, 78785, 78792, 78782, 78796 } }, // Vanquisher Helm [L]
        { 78172, new[] { 77025, 77019, 77015, 76750, 77010, 76976, 76213 } }, // Vanquisher Helm [N]
        { 78852, new[] { 78699, 78696, 78694, 78690, 78697, 78687, 78701 } }, // Vanquisher Helm [H]

        { 78872, new[] { 78812, 78817, 78816, 78810, 78807, 78814 } }, // Conqueror Legs [L]
        { 78181, new[] { 76768, 76346, 76341, 77006, 76877, 76359 } }, // Conqueror Legs [N]
        { 78856, new[] { 78717, 78722, 78721, 78715, 78712, 78719 } }, // Conqueror Legs [H]
            
        { 78873, new[] { 78800, 78801, 78806, 78799, 78813, 78804 } }, // Protector Legs [L]
        { 78176, new[] { 76991, 76986, 77036, 77043, 76759, 77031 } }, // Protector Legs [N]
        { 78857, new[] { 78705, 78706, 78711, 78704, 78718, 78709 } }, // Protector Legs [H]

        { 78871, new[] { 78803, 78809, 78808, 78805, 78802, 78811, 78815 } }, // Vanquisher Legs [L]
        { 78171, new[] { 77026, 77020, 77016, 76751, 76977, 77011, 76214 } }, // Vanquisher Legs [N]
        { 78858, new[] { 78708, 78714, 78713, 78710, 78707, 78716, 78720 } }, // Vanquisher Legs [H]

        { 78875, new[] { 78842, 78845, 78841, 78844, 78837, 78840 } }, // Conqueror Shoulders [L]
        { 78180, new[] { 76344, 76361, 76769, 76339, 76878, 77007 } }, // Conqueror Shoulders [N]
        { 78859, new[] { 78747, 78750, 78746, 78749, 78742, 78745 } }, // Conqueror Shoulders [H]
            
        { 78876, new[] { 78830, 78829, 78834, 78836, 78828, 78832 } }, // Protector Shoulders [L]
        { 78175, new[] { 76987, 76992, 76760, 77035, 77044, 77032 } }, // Protector Shoulders [N]
        { 78860, new[] { 78735, 78734, 78739, 78741, 78733, 78737 } }, // Protector Shoulders [H]

        { 78874, new[] { 78833, 78835, 78839, 78838, 78831, 78846, 78843 } }, // Vanquisher Shoulders [L]
        { 78170, new[] { 77027, 76753, 77022, 77017, 76978, 77012, 76216 } }, // Vanquisher Shoulders [N]
        { 78861, new[] { 78738, 78740, 78744, 78743, 78736, 78751, 78748 } }, // Vanquisher Shoulders [H]
        #endregion
            
        #region Firelands ALL
        { 71679, new[] { 71597, 71512, 71517, 71522, 71530, 71535 } }, // Conqueror Chest [H]
        { 71686, new[] { 71600, 71604, 71547, 71552, 71542, 71501 } }, // Protector Chest [H]
        { 71672, new[] { 71537, 71476, 71481, 71510, 71486, 71494, 71499 } }, // Vanquisher Chest [H]
            
        { 71676, new[] { 71594, 71532, 71527, 71513, 71518, 71523 } }, // Conqueror Gloves [H]
        { 71683, new[] { 71553, 71548, 71543, 71502, 71601, 71605 } }, // Protector Gloves [H]
        { 71669, new[] { 71538, 71477, 71482, 71507, 71496, 71487, 71491 } }, // Vanquisher Gloves [H]

        { 71677, new[] { 71595, 71528, 71533, 71524, 71519, 71514 } }, // Conqueror Helm [H]
        { 71684, new[] { 71544, 71554, 71549, 71606, 71503, 71599 } }, // Protector Helm [H]
        { 71670, new[] { 71539, 71483, 71478, 71508, 71497, 71488, 71492 } }, // Vanquisher Helm [H]
            
        { 71678, new[] { 71596, 71520, 71525, 71515, 71534, 71529 } }, // Conqueror Legs [H]
        { 71685, new[] { 71555, 71550, 71545, 71504, 71607, 71602 } }, // Protector Legs [H]
        { 71671, new[] { 71540, 71479, 71484, 71509, 71498, 71489, 71493 } }, // Vanquisher Legs [H]
            
        { 71680, new[] { 71598, 71521, 71516, 71526, 71531, 71536 } }, // Conqueror Shoulders [H]
        { 71687, new[] { 71546, 71556, 71551, 71505, 71603, 71608 } }, // Protector Shoulders [H]
        { 71673, new[] { 71541, 71480, 71485, 71511, 71495, 71500, 71490 } }, // Vanquisher Shoulders [H]
        #endregion
            
        #region Bastion of Twilight/Blackwing Descent/Throne of the Four Winds ALL
        { 65001, new[] { 65230, 65235, 65226, 65221, 65216, 65260 } }, // Conqueror Head [H]
        { 65000, new[] { 65271, 65266, 65246, 65256, 65251, 65206 } }, // Protector Head [H]
        { 65002, new[] { 65210, 65186, 65181, 65200, 65190, 65195, 65241 } }, // Vanquisher Head [H]

        { 65088, new[] { 65233, 65238, 65223, 65218, 65228, 65263 } }, // Conqueror Shoulders [H]
        { 65087, new[] { 65268, 65273, 65208, 65248, 65258, 65253 } }, // Protector Shoulders [H]
        { 65089, new[] { 65213, 65183, 65188, 65198, 65203, 65193, 65243 } }, // Vanquisher Shoulders [H]

        { 67423, new[] { 65232, 65237, 65214, 65219, 65224, 65262 } }, // Conqueror Chest [H]
        { 67424, new[] { 65249, 65264, 65269, 65254, 65204, 65244 } }, // Protector Chest [H]
        { 67425, new[] { 65212, 65179, 65184, 65192, 65197, 65202, 65239 } }, // Vanquisher Chest [H]

        { 67429, new[] { 65234, 65229, 65215, 65220, 65225, 65259 } }, // Conqueror Hands [H]
        { 67430, new[] { 65265, 65270, 65255, 65250, 65245, 65205 } }, // Protector Hands [H]
        { 67431, new[] { 65209, 65180, 65185, 65199, 65189, 65194, 65240 } }, // Vanquisher Hands [H]

        { 67428, new[] { 65236, 65231, 65222, 65227, 65217, 65261 } }, // Conqueror Legs [H]
        { 67427, new[] { 65272, 65267, 65257, 65252, 65247, 65207 } }, // Protector Legs [H]
        { 67426, new[] { 65211, 65187, 65182, 65201, 65191, 65196, 65242 } }, // Vanquisher Legs [H]
        #endregion
            
        // Wrath of the Lich King
        #region Icecrown Citadel

        #endregion
            
        #region Ulduar ALL
        { 45635, new[] { 45375, 45381, 45374, 45421, 45395, 45389 } }, // Conqueror Chest [10] Valor
        { 45632, new[] { 46154, 46173, 46178, 46137, 46168, 46193 } }, // Conqueror Chest [25] Conq
        { 45636, new[] { 45364, 45429, 45424, 45413, 45411, 45405 } }, // Protector Chest [10]
        { 45633, new[] { 46141, 46146, 46162, 46205, 46206, 46198 } }, // Protector Chest [25]
        { 45637, new[] { 45340, 45335, 45368, 45358, 45348, 45354, 45396 } }, // Vanquisher Chest [10]
        { 45634, new[] { 46111, 46118, 46130, 46159, 46186, 46194, 46123 } }, // Vanquisher Chest [25]
            
        { 45644, new[] { 45376, 45370, 45383, 45419, 45387, 45392 } }, // Conqueror Hands [10]
        { 45641, new[] { 46155, 46179, 46174, 46135, 46188, 46163 } }, // Conqueror Hands [25]
        { 45645, new[] { 45360, 45430, 45426, 45406, 45414, 45401 } }, // Protector Hands [10]
        { 45642, new[] { 46142, 46148, 46164, 46207, 46200, 46199 } }, // Protector Hands [25]
        { 45646, new[] { 45341, 45337, 46131, 45351, 45355, 45345, 45397 } }, // Vanquisher Hands [10]
        { 45643, new[] { 46113, 46119, 46132, 46189, 46158, 46183, 46124 } }, // Vanquisher Hands [25]
            
        { 45647, new[] { 45382, 45372, 45377, 45391, 45386, 45417 } }, // Conqueror Head [10]
        { 45638, new[] { 46175, 46180, 46156, 46172, 46197, 46140 } }, // Conqueror Head [25]
        { 45648, new[] { 45361, 45425, 45431, 45412, 45402, 45408 } }, // Protector Head [10]
        { 45639, new[] { 46143, 46166, 46151, 46212, 46201, 46209 } }, // Protector Head [25]
        { 45649, new[] { 45336, 45342, 45365, 46313, 45356, 45346, 45398 } }, // Vanquisher Head [10]
        { 45640, new[] { 46120, 46115, 46129, 46191, 46161, 46184, 46125 } }, // Vanquisher Head [25]
            
        { 45650, new[] { 45371, 45384, 45379, 45420, 45388, 45394 } }, // Conqueror Legs [10]
        { 45653, new[] { 46181, 46176, 46153, 46139, 46195, 46170 } }, // Conqueror Legs [25]
        { 45651, new[] { 45362, 45427, 45432, 45409, 45403, 45416 }}, // Protector Legs [10]
        { 45654, new[] { 46144, 46169, 46150, 46210, 46202, 46208 } }, // Protector Legs [25]
        { 45652, new[] { 45338, 45343, 45367, 45347, 45357, 45353, 45399 } }, // Vanquisher Legs [10]
        { 45655, new[] { 46121, 46116, 46133, 46185, 46160, 46192, 46126 } }, // Vanquisher Legs [25]
            
        { 45659, new[] { 45385, 45380, 45373, 45422, 45393, 45390 } }, // Conqueror Shoulders [10]
        { 45656, new[] { 46177, 46152, 46182, 46136, 46165, 46190 } }, // Conqueror Shoulders [25]
        { 45660, new[] { 45363, 45428, 45433, 45415, 45410, 45404 } }, // Protector Shoulders [10]
        { 45657, new[] { 46145, 46167, 46149, 46203, 46211, 46204 } }, // Protector Shoulders [25]
        { 45661, new[] { 45339, 45344, 45369, 45352, 45359, 45349, 45400 } }, // Vanquisher Shoulders [10]
        { 45658, new[] { 46122, 46117, 46134, 46196, 46157, 46187, 46127 } }, // Vanquisher Shoulders [25]
        #endregion
            
        #region Naxxramas/The Obsidian Sanctum ALL
        { 40610, new[] { 39497, 39523, 39638, 39633, 39629, 39515 } }, // Conqueror Chest [10]
        { 40625, new[] { 40423, 40458, 40579, 40574, 40569, 40449 } }, // Conqueror Chest [25]

        { 40611, new[] { 39579, 39606, 39611, 39597, 39592, 39588 } }, // Protector Chest [10]
        { 40626, new[] { 40503, 40525, 40544, 40523, 40514, 40508 } }, // Protector Chest [25]
            
        { 40612, new[] { 39558, 39554, 39538, 39547, 39492, 39617, 39623 } }, // Vanquisher Chest [10]
        { 40627, new[] { 40495, 40471, 40463, 40469, 40418, 40550, 40559 } }, // Vanquisher Chest [25]

        { 40613, new[] { 39519, 39530, 39500, 39634, 39632, 39639 } }, // Conqueror Hands [10]
        { 40628, new[] { 40445, 40454, 40420, 40575, 40570, 40580 } }, // Conqueror Hands [25]

        { 40614, new[] { 39582, 39609, 39622, 39593, 39601, 39591 } }, // Protector Hands [10]
        { 40629, new[] { 40504, 40527, 40545, 40515, 40520, 40509 } }, // Protector Hands [25]
            
        { 40615, new[] { 39560, 39544, 39557, 39543, 39495, 39618, 39624 } }, // Vanquisher Hands [10]
        { 40630, new[] { 40496, 40466, 40472, 40460, 40415, 40552, 40563 } }, // Vanquisher Hands [25]

        { 40616, new[] { 39521, 39514, 39496, 39640, 39628, 39635 } }, // Conqueror Head [10]
        { 40631, new[] { 40456, 40447, 40421, 40581, 40571, 40576 } }, // Conqueror Head [25]

        { 40617, new[] { 39578, 39610, 39605, 39602, 39583, 39594 } }, // Protector Head [10]
        { 40632, new[] { 40505, 40546, 40528, 40521, 40510, 40516 } }, // Protector Head [25]
            
        { 40618, new[] { 39561, 39545, 39553, 39531, 39491, 39625, 39619 } }, // Vanquisher Head [10]
        { 40633, new[] { 40499, 40467, 40473, 40461, 40416, 40565, 40554 } }, // Vanquisher Head [25]

        { 40619, new[] { 39517, 39528, 39498, 39630, 39641, 39636 } }, // Conqueror Legs [10]
        { 40634, new[] { 40448, 40457, 40422, 40572, 40583, 40577 } }, // Conqueror Legs [25]

        { 40620, new[] { 39580, 39612, 39607, 39595, 39589, 39603 } }, // Protector Legs [10]
        { 40635, new[] { 40506, 40547, 40529, 40517, 40512, 40522 } }, // Protector Legs [25]
            
        { 40621, new[] { 39564, 39539, 39555, 39546, 39493, 39626, 39620 } }, // Vanquisher Legs [10]
        { 40636, new[] { 40500, 40462, 40493, 40468, 40417, 40567, 40556 } }, // Vanquisher Legs [25]

        { 40622, new[] { 39529, 39499, 39642, 39637, 39631, 39518 } }, // Conqueror Shoulders [10]
        { 40637, new[] { 40459, 40424, 40584, 40578, 40573, 40450 } }, // Conqueror Shoulders [25]

        { 40623, new[] { 39581, 39613, 39608, 39604, 39596, 39590 } }, // Protector Shoulders [10]
        { 40638, new[] { 40507, 40548, 40530, 40524, 40518, 40513 } }, // Protector Shoulders [25]
            
        { 40624, new[] { 39565, 39548, 39556, 39542, 39494, 39627, 39621 } }, // Vanquisher Shoulders [10]
        { 40639, new[] { 40502, 40470, 40494, 40465, 40419, 40568, 40557 } }, // Vanquisher Shoulders [25]
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