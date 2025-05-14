export const openables = new Set<number>([
    // Holidays
    21746, // Lucky Red Envelope
    127148, // Silas' Secret Stash
    211429, // Bundle of Love Tokens
    232877, // Timely Goodie Bag
    233014, // Bronze Celebration Cache of Treasures

    // Shadowlands
    185834, // Orboreal Distinguishment

    // The War Within
    217011, // Amateur Actor's Chest
    217012, // Novice Actor's Chest
    217013, // Expert Actor's Chest
    222929, // Carved Coin Coffer
    222954, // Runed Coin Coffer
    224556, // Glorious Contender's Strongbox
    224557, // Field Medic's Hazard Payout
    224573, // Crystal Satchel of Cooperation
    224650, // Wax-Sealed Pouch
    224721, // Wax-Sealed Box
    224722, // Waxy Bundle of Resonance Crystals
    224723, // Waxy Bundle of Leather
    224724, // Waxy Bundle of Dust
    224725, // Waxy Bundle of Herbs
    224726, // Waxy Box of Rocks
    224784, // Pinnacle Cache
    225239, // Overflowing Council of Dornogal Trove
    225245, // Overflowing Trove of the Deeps
    225246, // Overflowing Hallowfall Trove
    225247, // Overflowing Severed Threads Trove
    225249, // Rattling Bag o' Gold
    225493, // Medal of Conquest
    225571, // The Weaver's Gratuity
    225572, // The General's War Chest
    225573, // The Vizier's Capital
    225739, // Algari Distinguishment
    226045, // The General's Trove
    226100, // The Vizier's Trove
    226103, // The Weaver's Trove
    226193, // Cache of Nerubian Treasures [N]
    226194, // Cache of Nerubian Treasures [H]
    226195, // Resonance Crystal Cluster
    226196, // Silk Kej Pouch
    226198, // Resonance Crystal Agglomeration
    226199, // Silk Kej Purse
    226256, // Token of the Remembrancers
    226257, // Delver's Pouch of Valorstones
    226258, // Delver's Pouch of Reagents
    226259, // Delver's Pouch of Resonance Crystals
    226260, // Delver's Pouch of Gold
    226263, // Theater Troupe's Trove
    226264, // Radiant Cache
    226273, // Awakened Mechanical Cache
    226339, // Nerubian Mining Supplies
    226392, // Careless Dasher's Treasure
    226814, // Chest of Gold
    227450, // Sky Racer's Purse
    227675, // Satchel of Surplus Herbs
    227676, // Satchel of Surplus Ore
    227681, // Satchel of Surplus Leather
    227682, // Satchel of Surplus Cloth
    227713, // Artisan's Consortium Payout
    227792, // Everyday Cache
    228220, // Waxy Bundle
    228337, // Satchel of Surplus Dust
    228361, // Seasoned Adventurer's Cache
    228610, // Artisan's Consortium Payout
    228611, // Artisan's Consortium Payout
    228612, // Artisan's Consortium Payout
    228741, // Lamplighter Supply Satchel
    228916, // Algari Tailor's Satchel
    228917, // Satchel of Ore
    228918, // Satchel of Leather
    228919, // Satchel of Algari Herbs
    228920, // Satchel of Chitin
    228931, // Algari Enchanter's Satchel
    228932, // Algari Engineer's Satchel
    228933, // Algari Leatherworker's Satchel
    229005, // Cache of Earthen Treasures
    229006, // Cache of Earthen Treasures
    229129, // Cache of Delver's Spoils
    229130, // Cache of Delver's Spoils
    229354, // Algari Adventurer's Cache
    231153, // Triumphant Satchel of Carved Undermine Crests
    231154, // Celebratory Pack of Runed Undermine Crests
    231264, // Glorious Cluster of Gilded Undermine Crests
    231267, // Pouch of Weathered Undermine Crests
    231269, // Satchel of Carved Undermine Crests
    231270, // Pack of Runed Undermine Crests
    232463, // Overflowing Undermine Trove
    232465, // Darkfuse Trove
    232602, // Forged Gladiator's Coin Pouch
    232615, // Prized Gladiator's Coin Pouch
    233071, // Delver's Bounty [S2]
    233276, // Delver's Starter Kit
    233281, // Delver's Cosmetic Surprise Bag
    233555, // Restored Coffer Key
    233557, // Sifted Pile of Scrap
    233558, // S.C.R.A.P. Scrubbed Deluxe
    234729, // Cache of Undermine Treasures
    234731, // Cache of Undermine Treasures
    234743, // Steamwheedle's Trove
    234744, // Blackwater's Trove
    234745, // Bilgewater's Trove
    234746, // Venture Co.'s Trove
    235052, // Weathered Mysterious Satchel [uncommon]
    235054, // Pristine Mysterious Satchel
    235151, // Distinguished Actor's Chest
    235258, // Bilgewater's Trove
    235259, // Bilgewater's Trove
    235260, // Blackwater's Trove
    235261, // Blackwater's Trove
    235262, // Steamwheedle's Trove
    235263, // Steamwheedle's Trove
    235264, // Venture Co.'s Trove
    235265, // Venture Co.'s Trove
    235531, // Restored Coffer Key
    235558, // Box of Darkfuse Miscellany
    235610, // Seasoned Adventurer's Cache [S2]
    235639, // Seasoned Adventurer's Cache [S2]
    235911, // Weathered Mysterious Satchel [rare]
    236756, // Socially Expected Tip Chest
    236757, // Generous Tip Chest
    236758, // Extravagant Tip Chest
    236944, // Weathered Mysterious Satchel [epic]
    237014, // Severed Threads Commendation
    237132, // Bilgewater Trove
    237133, // Venture Co. Trove
    237134, // Steamwheedle Trove
    237135, // Blackwater Trove
    237743, // Arathi Soldier's Coffer
    237759, // Arathi Cleric's Chest
    237760, // Arathi Champion's Spoils
    238207, // Nanny's Surge Dividends
    238208, // Nanny's Surge Dividends
    239004, // Radiant Service Satchel
    239118, // Pinnacle Cache [S2]
    239120, // Seasoned Adventurer's Cache [S2]
    239489, // Radiant Officer's Cache
    239546, // Confiscated Cultist's Bag
    242386, // Lorewalker's Crate of Memorabilia

    221269, // Crimson Valorstone
    225896, // Void-Touched Valorstone
    226813, // Golden Valorstone
    220773, // Celebratory Pack of Runed Harbinger Crests
    220776, // Glorious Cluster of Gilded Harbinger Crests
    220767, // Triumphant Satchel of Carved Harbinger Crests
    221268, // Pouch of Weathered Harbinger Crests
    221373, // Satchel of Carved Harbinger Crests
    221375, // Pack of Runed Harbinger Crests

    227668, // Delver's Bounty T1
    227778, // Delver's Bounty T2
    227779, // Delver's Bounty T3
    227780, // Delver's Bounty T4
    227781, // Delver's Bounty T5
    227782, // Delver's Bounty T6
    227783, // Delver's Bounty T7
    227784, // Delver's Bounty T8

    // TWW Raid Tokens
    225614, // Dreadful Blasphemer's Effigy
    225622, // Dreadful Conniver's Badge
    225630, // Dreadful Obscenity's Idol
    225626, // Dreadful Slayer's Icon
    225618, // Dreadful Stalwart's Emblem
    225615, // Mystic Blasphemer's Effigy
    225623, // Mystic Conniver's Badge
    225631, // Mystic Obscenity's Idol
    225627, // Mystic Slayer's Icon
    225619, // Mystic Stalwart's Emblem
    225616, // Venerated Blasphemer's Effigy
    225624, // Venerated Conniver's Badge
    225632, // Venerated Obscenity's Idol
    225628, // Venerated Slayer's Icon
    225620, // Venerated Stalwart's Emblem
    225617, // Zenith Blasphemer's Effigy
    225625, // Zenith Conniver's Badge
    225633, // Zenith Obscenity's Idol
    225629, // Zenith Slayer's Icon
    225621, // Zenith Stalwart's Emblem
    226206, // Mark of the Spelunker Supreme

    // TWW Professions
    228724, // Flicker of Alchemy Knowledge
    228726, // Flicker of Blacksmithing Knowledge
    228728, // Flicker of Enchanting Knowledge
    228730, // Flicker of Engineering Knowledge
    228732, // Flicker of Inscription Knowledge
    228734, // Flicker of Jewelcrafting Knowledge
    228736, // Flicker of Leatherworking Knowledge
    228738, // Flicker of Tailoring Knowledge
    228725, // Glimmer of Alchemy Knowledge
    228727, // Glimmer of Blacksmithing Knowledge
    228729, // Glimmer of Enchanting Knowledge
    228731, // Glimmer of Engineering Knowledge
    228733, // Glimmer of Inscription Knowledge
    228735, // Glimmer of Jewelcrafting Knowledge
    228737, // Glimmer of Leatherworking Knowledge
    228739, // Glimmer of Tailoring Knowledge
]);
