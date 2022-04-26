import { PlayableClass } from '@/types/enums'


export const legendaryBonusIDs: Record<number, number> = {
    6823: 327508, // Slick Ice
    6828: 327284, // Cold Front
    6829: 327364, // Freezing Winds
    6830: 327492, // Glacial Fragments
    6831: 327489, // Expanded Potential
    6832: 327365, // Disciplinary Command
    6834: 327351, // Temporal Warp
    6926: 332769, // Arcane Infinity
    6927: 332892, // Arcane Bombardment
    6928: 332928, // Siphon Storm
    6931: 333030, // Fevered Incantation
    6932: 333097, // Firestorm
    6933: 333167, // Molten Skyfall
    6934: 333313, // Sun King's Blessing
    6936: 333373, // Triune Ward
    6937: 333393, // Grisly Icicle
    6940: 334501, // Bryndaor's Might
    6941: 334525, // Crimson Rune Weapon
    6942: 334547, // Vampiric Aura
    6943: 334580, // Gorefiend's Domination
    6944: 334583, // Koltira's Favor
    6945: 334678, // Biting Cold
    6946: 334692, // Absolute Zero
    6947: 334728, // Death's Embrace
    6948: 334724, // Grip of the Everlasting
    6949: 334836, // Reanimated Shambler
    6950: 334888, // Frenzied Monstrosity
    6951: 334898, // Death's Certainty
    6952: 334949, // Deadliest Coil
    6953: 334974, // Superstrain
    6954: 335177, // Phearomones
    6955: 335214, // Leaper
    6956: 335229, // Thunderlord
    6957: 335239, // The Wall
    6958: 335253, // Misshapen Mirror
    6959: 335266, // Signet of Tormented Kings
    6960: 335274, // Battlelord
    6961: 335451, // Exploiter
    6962: 335458, // Enduring Blow
    6963: 335555, // Cadence of Fujieda
    6964: 335567, // Deathmaker
    6965: 335582, // Reckless Defense
    6966: 335594, // Will of the Berserker
    6967: 335629, // Unbreakable Will
    6969: 335718, // Reprisal
    6970: 335282, // Unhinged
    6971: 335758, // Seismic Reverberation
    6972: 336470, // Vault of Heavens
    6973: 336400, // Divine Image
    6974: 336266, // Flash Concentration
    6975: 336370, // Cauterizing Shadows
    6976: 336011, // The Penitent One
    6977: 336314, // Harmonious Apparatus
    6978: 336507, // Crystalline Reflection
    6979: 336133, // Kiss of Death
    6980: 336067, // Clarity of Mind
    6981: 336165, // Painbreaker Psalm
    6982: 336143, // Shadowflame Prism
    6983: 336214, // Eternal Call to the Void
    6984: 337477, // X'anshi, Return of Archbishop Benedictus
    6985: 336741, // Ancestral Reminder
    6986: 336739, // Deeptremor Stone
    6987: 336738, // Deeply Rooted Elements
    6988: 336735, // Chains of Devastation
    6989: 336734, // Skybreaker's Fiery Demise
    6990: 336730, // Elemental Equilibrium
    6991: 336215, // Echoes of Great Sundering
    6992: 336063, // Windspeaker's Lava Resurgence
    6993: 335902, // Doom Winds
    6994: 335899, // Legacy of the Frost Witch
    6995: 335897, // Witch Doctor's Wolf Bones
    6996: 335895, // Primal Lava Actuators
    6997: 335893, // Jonat's Natural Focus
    6998: 335891, // Spiritwalker's Tidal Totem
    6999: 335889, // Primal Tide Core
    7000: 335886, // Earthen Harmony
    7002: 336897, // Twins of the Sun Priestess
    7003: 336742, // Call of the Wild
    7004: 336743, // Nessingwary's Trapping Apparatus
    7005: 336745, // Soulforge Embers
    7006: 336747, // Craven Strategem
    7007: 336819, // Dire Command
    7008: 336822, // Flamewaker's Cobra Sting
    7009: 336830, // Qa'pla, Eredun War Order
    7010: 336844, // Rylakstalker's Piercing Fangs
    7011: 336849, // Eagletalon's True Focus
    7012: 336867, // Surging Shots
    7013: 336870, // Serpentstalker's Trickery
    7014: 336878, // Secrets of the Unblinking Vigil
    7015: 336895, // Wildfire Cluster
    7016: 336901, // Rylakstalker's Confounding Strikes
    7017: 336902, // Latent Poison Injectors
    7018: 336907, // Butcher's Bone Fragments
    7025: 337020, // Wilfred's Sigil of Superior Summoning
    7026: 337038, // Claw of Endereth
    7027: 337057, // Relic of Demonic Synergy
    7028: 337065, // Pillars of the Dark Portal
    7029: 337106, // Perpetual Agony of Azj'Aqir
    7030: 337111, // Sacrolash's Dark Strike
    7031: 337122, // Malefic Wrath
    7032: 337128, // Wrath of Consumption
    7033: 337135, // Implosive Potential
    7034: 337141, // Grim Inquisitor's Dread Calling
    7035: 337146, // Forces of the Horned Nightmare
    7036: 337159, // Balespider's Burning Core
    7037: 337163, // Odr, Shawl of the Ymirjar
    7038: 337166, // Cinders of the Azj'Aqir
    7039: 337169, // Madness of the Azj'Aqir
    7040: 337272, // Embers of the Diabolic Raiment
    7041: 337504, // Collective Anguish
    7043: 337534, // Darkglare Medallion
    7044: 337539, // Darkest Hour
    7045: 337541, // Spirit of the Darkness Flame
    7046: 337544, // Razelikh's Defilement
    7047: 337545, // Fel Flame Fortification
    7048: 337547, // Fiery Soul
    7050: 337551, // Chaos Theory
    7051: 337685, // Erratic Fel Core
    7052: 337775, // Fel Bombardment
    7053: 337600, // Uther's Devotion
    7054: 337594, // The Mad Paragon
    7055: 337746, // Of Dusk and Dawn
    7056: 337681, // The Magistrate's Judgment
    7057: 337812, // Shadowbreaker, Dawn of the Sun
    7058: 337777, // Inflorescence of the Sunwell
    7059: 337825, // Shock Barrier
    7060: 337831, // Holy Avenger's Engraved Sigil
    7061: 337838, // The Ardent Protector's Sanctum
    7062: 337847, // Bulwark of Righteous Fury
    7063: 337850, // Reign of Endless Kings
    7064: 337247, // Final Verdict
    7065: 337638, // Vanguard's Momentum
    7066: 337297, // Relentless Inquisitor
    7067: 337257, // Tempest of the Lightbringer
    7068: 337334, // Keefer's Skyreach
    7069: 337292, // Last Emperor's Capacitor
    7070: 337481, // Xuen's Treasure
    7071: 337483, // Jade Ignition
    7072: 337473, // Tear of Morning
    7073: 337225, // Yu'lon's Whisper
    7074: 337343, // Clouded Focus
    7075: 337172, // Ancient Teachings of the Monastery
    7076: 338138, // Charred Passions
    7077: 337288, // Stormstout's Last Keg
    7078: 337290, // Celestial Infusion
    7079: 337570, // Shaohao's Might
    7080: 337294, // Swiftsure Wraps
    7081: 337296, // Fatal Touch
    7082: 337298, // Invoker's Delight
    7084: 338608, // Oath of the Elder Druid
    7085: 338657, // Circle of Life and Death
    7086: 338658, // Draught of Deep Focus
    7087: 338661, // Oneth's Clear Vision
    7088: 338668, // Primordial Arcanic Pulsar
    7089: 339144, // Cat-Eye Curio
    7090: 339141, // Eye of Fearful Symmetry
    7091: 339139, // Apex Predator's Craving
    7092: 339060, // Luffa-Infused Embrace
    7093: 339063, // The Natural Order's Will
    7094: 339056, // Ursoc's Fury Remembered
    7095: 339062, // Legacy of the Sleeper
    7096: 339064, // Memory of the Mother Tree
    7097: 338831, // The Dark Titan's Lesson
    7098: 338829, // Verdant Infusion
    7099: 338832, // Vision of Unending Growth
    7100: 338477, // Echo of Eonar
    7101: 339344, // Judgment of the Arbiter
    7102: 339340, // Norgannon's Sagacity
    7103: 339348, // Sephuz's Proclamation
    7104: 339351, // Stable Phantasma Lure
    7105: 339058, // Third Eye of the Jailer
    7106: 338743, // Vitality Sacrifice
    7107: 339942, // Balance of All Things
    7108: 339949, // Timeworn Dreambinder
    7109: 340053, // Frenzyband
    7110: 340059, // Lycara's Fleeting Glimpse
    7111: 340076, // Mark of the Master Assassin
    7112: 340078, // Tiny Toxic Blade
    7113: 340079, // Essence of Bloodfang
    7114: 340080, // Invigorating Shadowdust
    7115: 340081, // Dashing Scoundrel
    7116: 340082, // Doomblade
    7117: 340083, // Zoldyck Insignia
    7118: 340084, // Duskwalker's Patch
    7119: 340085, // Greenskin's Wickers
    7120: 340086, // Guile Charm
    7121: 340087, // Celerity
    7122: 340088, // Concealed Blunderbuss
    7123: 340089, // Finality
    7124: 340090, // Akaari's Soul Fragment
    7125: 340091, // The Rotten
    7126: 340092, // Deathly Shadows
    7128: 340458, // Maraad's Dying Breath
    7159: 340197, // Maw Rattle
    7160: 341724, // Rage of the Frozen Champion
    7161: 341804, // Measured Contemplation
    7162: 342415, // Talbadar's Stratagem
    7184: 343250, // Escape from Reality
    7218: 346264, // Darker Nature
    7219: 346279, // Burning Wound
    7458: 353447, // Abomination's Frenzy
    7466: 353882, // Rampant Transference
    7467: 353822, // Final Sentence
    7468: 353699, // Insatiable Hunger
    7469: 353577, // Glory
    7470: 354131, // Sinful Surge
    7471: 354161, // Nature's Fury
    7472: 354123, // Locust Swarm
    7473: 354186, // Harmonic Echo
    7474: 354109, // Sinful Hysteria
    7475: 354294, // Death's Fathom
    7476: 354333, // Sinful Delight
    7477: 354115, // Kindred Affinity
    7478: 354473, // Toxic Onslaught
    7570: 354647, // Splintered Elements
    7571: 354118, // Celestial Spirits
    7572: 354703, // Obedience
    7573: 354731, // Deathspike
    7577: 354837, // Resounding Clarity
    7679: 355098, // Divine Resonance
    7680: 355099, // Duty-Bound Gavel
    7681: 355886, // Agony Gaze
    7698: 355890, // Blazing Slaughter
    7699: 355893, // Blind Faith
    7700: 355996, // Demonic Oath
    7701: 355447, // Radiant Embers
    7702: 355100, // Seasons of Plenty
    7703: 356391, // Bwonsamdi's Pact
    7704: 356392, // Shadow Word: Manipulation
    7707: 356592, // Bountiful Brew
    7708: 356218, // Seeds of Rampant Growth
    7709: 356250, // Elemental Conduit
    7710: 356254, // Languishing Soul Detritus
    7711: 356344, // Shard of Annihilation
    7712: 356362, // Decaying Soul Satchel
    7713: 356259, // Contained Perpetual Explosion
    7714: 356262, // Pact of the Soulstalkers
    7715: 356264, // Bag of Munitions
    7716: 356375, // Fragments of the Elder Antlers
    7717: 356618, // Pouch of Razor Fragments
    7718: 356684, // Call to Arms
    7721: 356705, // Faeline Harmony
    7722: 356789, // Raging Vesper Vortex
    7726: 356818, // Sinister Teachings
    7727: 356877, // Heart of the Fae
    7728: 356395, // Spheres' Harmony
    7729: 356390, // Pallid Command
    7730: 357996, // Elysian Might
    8119: 364758, // Unity
    8120: 364824, // Unity
    8121: 364814, // Unity
    8122: 364743, // Unity
    8123: 364852, // Unity
    8124: 364857, // Unity
    8125: 364642, // Unity
    8126: 364911, // Unity
    8127: 364922, // Unity
    8128: 364738, // Unity
    8129: 364939, // Unity
    8130: 364929, // Unity
}

export const classUnity: Record<number, number> = {
    [PlayableClass.DeathKnight]: 364758,
    [PlayableClass.DemonHunter]: 364824,
    [PlayableClass.Druid]: 364814,
    [PlayableClass.Hunter]: 364743,
    [PlayableClass.Mage]: 364852,
    [PlayableClass.Monk]: 364857,
    [PlayableClass.Paladin]: 364642,
    [PlayableClass.Priest]: 364911,
    [PlayableClass.Rogue]: 364922,
    [PlayableClass.Shaman]: 364738,
    [PlayableClass.Warlock]: 364939,
    [PlayableClass.Warrior]: 364929,
}
