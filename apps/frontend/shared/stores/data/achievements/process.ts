import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

import { DataAchievements, type RawAchievements } from './types';
import {
    AchievementDataAchievement,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    type AchievementDataCategory,
} from '@/types/achievement-data';
import { extraCategories, forceSupersededBy, forceSupersedes } from '@/data/achievements';

export function processAchievementsData(rawData: RawAchievements): DataAchievements {
    console.time('processAchievementsData');
    const ret = new DataAchievements();

    ret.categories = cloneDeep(rawData.categories);

    for (const rawAchievement of rawData.achievementRaw) {
        const obj = new AchievementDataAchievement(...rawAchievement);

        if (forceSupersedes[obj.id]) {
            obj.supersedes = forceSupersedes[obj.id];
        }
        if (forceSupersededBy[obj.id]) {
            obj.supersededBy = forceSupersededBy[obj.id];
        }

        ret.achievementById.set(obj.id, obj);
    }

    for (const rawCriteria of rawData.criteriaRaw) {
        const obj = new AchievementDataCriteria(...rawCriteria);
        ret.criteriaById.set(obj.id, obj);
    }

    for (const rawCriteriaTree of rawData.criteriaTreeRaw) {
        const obj = new AchievementDataCriteriaTree(...rawCriteriaTree);
        ret.criteriaTreeById.set(obj.id, obj);
    }

    for (const achievementId of rawData.hideIds) {
        ret.isHidden[achievementId] = true;
    }

    ret.categories.push(null);
    let categoryId = 100000;
    for (const extraCategory of extraCategories) {
        const reputations = ret.categories.find((cat) => cat?.slug === 'reputation');
        let slugCat: AchievementDataCategory;
        if (extraCategory.slug === 'prepatch-midnight') {
            slugCat = {
                id: 1_000_001,
                name: 'Prepatch: Midnight ',
                slug: 'prepatch-midnight',
                achievementIds: [],
                children: [],
            };
        } else if (extraCategory.slug === 'outland-cup') {
            slugCat = {
                id: 1_000_002,
                name: 'Outland Cup',
                slug: 'outland-cup-hidden',
                achievementIds: [],
                children: [],
            };
        } else {
            slugCat = reputations?.children.find((child) => child.slug === extraCategory.slug);
        }
        if (!slugCat) {
            console.log('uh oh', extraCategory);
            continue;
        }

        const category: AchievementDataCategory = {
            id: categoryId++,
            name: slugCat.name,
            slug: slugCat.slug,
            achievementIds: extraCategory.achievementIds || [],
            children: [],
        };

        for (const child of extraCategory.children) {
            if (child === null) {
                category.children.push(null);
                continue;
            }

            const {
                targetSlug: childSlug,
                nameType: childNameType,
                overrideSlug: childSlugOverride,
                overrideName: childNameOverride,
            } = child;

            const [childSlug1, childSlug2] = childSlug.split('/');
            const childCat1 = find(ret.categories, (c) => c !== null && c.slug === childSlug1);
            const childCat2 = find(childCat1?.children || [], (c) => c.slug === childSlug2);
            if (childCat2) {
                let childName: string;
                let childSlug: string;
                if (childNameType === 1) {
                    childName = childCat1.name;
                    childSlug = childCat1.slug;
                } else if (childNameType === 2) {
                    childName = childCat2.name;
                    childSlug = childCat2.slug;
                } else if (childNameType === 3) {
                    childName = childNameOverride;
                    childSlug = childSlugOverride;
                }

                category.children.push({
                    id: childCat2.id,
                    name: childName,
                    slug: childSlug,
                    achievementIds: (child.achievementIds || []).concat(childCat2.achievementIds),
                    children: [],
                });
            } else {
                console.log('womp womp', childSlug1, childSlug2);
            }
        }

        ret.categories.push(category);
    }

    ret.categories.push(null);

    categoryId = 200000;
    // BfA hack
    ret.categories.push({
        id: categoryId++,
        name: '[BfA] A Farewell to Arms',
        slug: 'farewell-to-arms',
        achievementIds: [
            40953, // A Farewell to Arms

            40960, // Uldir
            40961, // Battle of Dazar'alor
            13414, // Crucible of Storms
            40962, // The Eternal Palace
            40963, // Ny'alotha, the Waking City

            12807, // Battle for Azeroth Dungeon Hero
            // expand

            40956, // I'm On Island Time
            41202, // \- Hot Tropic
            12944, // \--- Adventurer of Zuldazar
            12851, // \--- Treasures of Zuldazar
            12614, // \--- Loa Expectations
            13020, // \--- Bow to Your Masters
            12482, // \--- Get Hek'd
            13036, // \--- A Loa of a Tale
            13029, // \--- Eating Out of the Palm of My Tiny Hand
            13038, // \--- Raptari Rider
            41205, // \- Sound Off
            12939, // \--- Adventurer of Tiragarde Sound
            12852, // \--- Treasures of Tiragarde Sound
            13050, // \--- Bless the Rains Down in Freehold
            13057, // \--- Sailed in Sea Minor
            13061, // \--- Three Sheets to the Wind
            13058, // \--- Kul Tiran Up the Dance Floor
            13049, // \--- The Long Con
            41203, // \- Bwon Voyage
            12942, // \--- Adventurer of Nazmir
            12771, // \--- Treasures of Nazmir
            13024, // \--- Carved in Stone, Written in Blood
            13023, // \--- It's Really Getting Out of Hand
            12588, // \--- Eat Your Greens
            13028, // \--- Hoppin' Sad
            13022, // \--- Revenge is Best Served Speedily
            13021, // \--- A Most Efficient Apocalypse
            41206, // \- Songs of Storms
            12940, // \--- Adventurer of Stormsong Valley
            12853, // \--- Treasures of Stormsong Valley
            13047, // \--- Clever Use of Mechanical Explosives
            13046, // \--- These Hills Sing
            13051, // \--- Legends of the Tidesages
            13045, // \--- Every Day I'm Truffling
            13062, // \--- Let's Bee Friends
            13053, // \--- Deadliest Cache
            41204, // \- Dune Squad
            12943, // \--- Adventurer of Vol'dun
            12849, // \--- Treasures of Vol'dun
            13016, // \--- Scavenger of the Sands
            13018, // \--- Dune Rider
            13011, // \--- Scourge of Zem'lan
            13009, // \--- Adept Sandfisher
            13017, // \--- Champion of the Vulpera
            13437, // \--- Scavenge like a Vulpera
            41207, // \- When the Drust Settles
            12941, // \--- Adventurer of Drustvar
            12995, // \--- Treasures of Drustvar
            13087, // \--- Sausage Sampler
            13083, // \--- Better, Faster, Stronger
            13064, // \--- Drust the Facts, Ma'am
            13094, // \--- Cursed Game Hunter
            13082, // \--- Everything Old Is New Again
            12593, // \- Loremaster of Kul Tiras
            12473, // \--- A Sound Plan
            12497, // \--- Drust Do It.
            12496, // \--- Stormsong and Dance
            13294, // \- Loremaster of Zandalar
            11861, // \--- The Throne of Zuldazar
            11868, // \--- The Dark Heart of Nazmir
            12478, // \--- Secrets in the Sands
            12988, // \- Battle for Azeroth Explorer
            12556, // \--- Explore Tiragarde Sound
            12557, // \--- Explore Drustvar
            12558, // \--- Explore Stormsong Valley
            12559, // \--- Explore Zuldazar
            12561, // \--- Explore Nazmir
            12560, // \--- Explore Vol'dun
            13144, // \- Wide World of Quests

            40955, // War Stories
            12555, // \- Welcome to Zandalar
            12582, // \- Come Sail Away
            13517, // \- Two Sides to Every Tale
            [
                13925, // \- The Fourth War [A]
                13924, // \- The Fourth War [H]
            ],
            12719, // \- Spirits Be With You
            13263, // \- The Shadow Hunter
            12997, // \- The Pride of Kul Tiras
            13251, // \- In Teldrassil's Shadow
            [
                13553, // \- The Mechagonian Threat [A]
                13700, // \- The Mechagonian Threat [H]
            ],
            [
                13710, // \- Sunken Ambitions [A]
                13709, // \- Unfathomable [H]
            ],
            14157, // \- The Corruptor's End

            12947, // Azerothian Diplomat

            13134, // Expedition Leader
            13122, // \- Island Conqueror
            13125, // \- Azerite Admiral
            13126, // \- Give Me The Energy
            13127, // \- Tell Me A Tale
            13124, // \- Metal Detector
            13128, // \- I'm Here for the Pets
            13132, // \- Helping Hand
            12595, // \- Expert Expeditioner
            [
                13133, // \- Team Deathmatch [A]
                13135, // \- Team Deathmatch [H]
            ],

            40957, // Maximum Effort
            [
                12881, // \- War is Hell [A]
                12873, // \- War is Hell [H]
            ],
            [
                13297, // \- War for the Shore [A]
                13296, // \- War for the Shore [H]
            ],
            12872, // \- The Dirty Five
            [
                12896, // \- Azeroth at War: The Barrens [A]
                12867, // \- Azeroth at War: The Barrens [H]
            ],
            [
                12898, // \- Azeroth at War: After Lordaeron [A]
                12869, // \- Azeroth at War: After Lordaeron [H]
            ],
            [
                12899, // \- Azeroth at War: Kalimdor on Fire [A]
                12870, // \- Azeroth at War: Kalimdor on Fire [H]
            ],
            [
                13283, // \- Frontline Warrior [A]
                13284, // \- Frontline Warrior [H]
            ],

            13638, // Undersea Usurper Undersea Usurper

            13541, // Mecha-Done Mecha-Done
            // 13553, // \- The Mechagonian Threat [A]
            // 13700, // \- The Mechagonian Threat [H]
            13470, // \- Rest In Pistons
            13556, // \- Outside Influences
            13479, // \- Junkyard Architect
            13477, // \- Junkyard Apprentice
            13474, // \- Junkyard Machinist
            13513, // \- Available in Eight Colors
            13686, // \- Junkyard Melomaniac
            13791, // \- Making the Mount
            13790, // \- Armed for Action

            40959, // Black Empire State of Mind
            14154, // \- Defend the Vale
            14153, // \- Uldum Under Assault
            14156, // \- The Rajani
            14155, // \- Uldum Accord
            14159, // \- Combating the Corruption
            14158, // \- It's Not A Tumor!
            14161, // \- All Consuming

            13994, // Through the Depths of Visions
            14066, // \- The Most Horrific Vision of Stormwind
            14067, // \- The Most Horrific Vision of
            14060, // \- Unwavering Resolve
            14061, // \- We Have the Technology

            40958, // Full Heart, Can't Lose
            12918, // \- Have a Heart
            13572, // \- The Heart Forge
            13771, // \- Power Is Beautiful
            13777, // \- My Heart Container is Full

            41209, // Dressed to Kill: Battle for Azeroth
            12991, // \- New Mog, G'huun This?
            12993, // \- Don't Warfront Me
            13385, // \- Daz'aling Attire
            13433, // \- Tall, Dark, and Sinister
            13571, // \- Under the Seams
            13585, // \- Never Lose, Never Choose To
            14058, // \- All Eyes On Me
            14059, // \- The Eyes Have It

            14730, // To All the Squirrels I Set Sail to See
        ],
        children: [],
    });

    // BfA Nazjatar hack
    ret.categories.push({
        id: categoryId++,
        name: '[BfA] Undersea Usurper',
        slug: 'undersea-usurper',
        achievementIds: [
            13638, // Undersea Usurper

            13635, // Tour of the Depths
            13690, // Nazjatarget Eliminated
            13691, // I Thought You Said They'd Be Rare?

            [
                13704, // [A] Nautical Battlefield Training
                13645, // [H] Nautical Battlefield Training
            ],
            [
                13762, // [A] Aqua Team Murder Force
                13761, // [H] Aqua Team Murder Force
            ],
            // [
            //     13744, // Seasoned: Bladesman Inowari
            //     13746, // Seasoned: Neri Sharpfin
            // ],
            // [
            //     13745, // Seasoned: Farseer Ori
            //     13747, // Seasoned: Poen Gillbrack
            // ],
            // [
            //     13743, // Seasoned: Hunter Akana
            //     13748, // Seasoned: Vim Brineheart
            // ],
            // [
            //     13754, // Veteran: Bladesman Inowari
            //     13749, // Veteran: Neri Sharpfin
            // ],
            // [
            //     13755, // Veteran: Farseer Ori
            //     13751, // Veteran: Poen Gillbrack
            // ],
            // [
            //     13753, // Veteran: Hunter Akana
            //     13752, // Veteran: Vim Brineheart
            // ],
            [
                13759, // Battle-Scarred: Bladesman Inowari
                13750, // Battle-Scarred: Neri Sharpfin
            ],
            [
                13760, // Battle-Scarred: Farseer Ori
                13756, // Battle-Scarred: Poen Gillbrack
            ],
            [
                13758, // Battle-Scarred: Hunter Akana
                13757, // Battle-Scarred: Vim Brineheart
            ],

            13549, // Trove Tracker
            13711, // A Fistful of Manapearls
            13722, // Terror of the Tadpoles
            13699, // Periodic Destruction
            13713, // Nothing To Scry About
            13707, // Mrrl's Secret Stash
            13763, // Back to the Depths!
            13764, // Puzzle Performer
            13712, // Explore Nazjatar
            [
                13558, // [A] Waveblade Ankoan
                13559, // [H] The Unshackled
            ],
            13765, // Subaquatic Support
            [
                13710, // [A] Sunken Ambitions
                13709, // [H] Unfathomable
            ],
            13836, // Feline Figurines Found
        ],
        children: [],
    });

    // SL hack
    ret.categories.push({
        id: categoryId++,
        name: '[SL] Back from the Beyond',
        slug: 'back-from-the-beyond',
        achievementIds: [
            20501, // Back from the Beyond

            14715, // Castle Nathria
            14961, // Chains of Domination
            15647, // Dead Men Tell Some Tales
            15178, // Fake It 'Til You Make It

            15336, // From A to Zereth
            15259, // From A to Zereth > Secrets of the First Ones
            15331, // From A to Zereth > Treasures of Zereth Mortis
            15392, // From A to Zereth > Dune Dominance
            15391, // From A to Zereth > Adventurer of Zereth Mortis
            15402, // From A to Zereth > Cyphers of the First Ones
            15407, // From A to Zereth > Synthe-fived!
            15220, // From A to Zereth > The Enlightened

            15079, // Many, Many Things
            15651, // Myths of the Shadowland Dungeons
            15035, // On the Offensive
            15646, // Re-Re-Re-Renowned
            15025, // Sanctum Superior
            15126, // Sanctum of Domination
            // 15259, // Secrets of the First Ones
            15417, // Sepulcher of the First Ones

            15649, // Shadowlands Dilettante
            14502, // Shadowlands Dilettante > Pursuing Loyalty
            14723, // Shadowlands Dilettante > Be Our Guest
            14752, // Shadowlands Dilettante > Things To Do When You're Dead
            14684, // Shadowlands Dilettante > Things To Do When You're Dead > Abominable Lives
            14748, // Shadowlands Dilettante > Things To Do When You're Dead > Wardrobe Makeover
            14751, // Shadowlands Dilettante > Things To Do When You're Dead > The Gang's All Here
            14753, // Shadowlands Dilettante > Things To Do When You're Dead > It's a Wrap
            14775, // Shadowlands Dilettante > Mush Appreciated

            15324, // Tower Ranger
            15322, // Tower Ranger > Flawless Master (Layer 16)
            15067, // Tower Ranger > Adamant Vaults
            14468, // Tower Ranger > Twisting Corridors: Layer 1
            14469, // Tower Ranger > Twisting Corridors: Layer 2
            14470, // Tower Ranger > Twisting Corridors: Layer 3
            14471, // Tower Ranger > Twisting Corridors: Layer 4
            14472, // Tower Ranger > Twisting Corridors: Layer 5
            14568, // Tower Ranger > Twisting Corridors: Layer 6
            14569, // Tower Ranger > Twisting Corridors: Layer 7
            14570, // Tower Ranger > Twisting Corridors: Layer 8
            15251, // Tower Ranger > The Jailer's Gauntlet: Layer 1
            15252, // Tower Ranger > The Jailer's Gauntlet: Layer 2
            15253, // Tower Ranger > The Jailer's Gauntlet: Layer 3
            15254, // Tower Ranger > The Jailer's Gauntlet: Layer 4
            15092, // Tower Ranger > Master of Torment
            15093, // Tower Ranger > Master of Torment > Avenge Me!
            15095, // Tower Ranger > Master of Torment > No Doubt
            15094, // Tower Ranger > Master of Torment > Rampage
            15096, // Tower Ranger > Master of Torment > Crowd Pleaser

            15648, // Walking in Maw-mphis
            14895, // Walking in Maw-mphis > 'Ghast Five
            14744, // Walking in Maw-mphis > Better to Be Lucky Than Dead
            14660, // Walking in Maw-mphis > It's About Sending a Message
            14738, // Walking in Maw-mphis > Hunting Party
            14656, // Walking in Maw-mphis > Trading Partners
            14658, // Walking in Maw-mphis > Soulkeeper's Burden
            14663, // Walking in Maw-mphis > Explore The Maw
        ],
        children: [],
    });

    // DF hack
    ret.categories.push({
        id: categoryId++,
        name: '[DF] A World Awoken',
        slug: 'a-world-awoken',
        achievementIds: [
            19458, // A World Awoken

            16343, // Vault of the Incarnates
            18160, // Aberrus, the Shadowd Crucible
            19331, // Amirdrassil, the Dream's Hope
            16339, // Myths of the Dragonflight Dungeons

            16585, // Loremaster of the Dragon Isles
            16334, // Waking Hope
            16401, // Sojourner of the Waking Shores
            15394, // Ohn'a'Roll
            16405, // Sojourner of Ohn'ahran Plains
            16336, // Azure Spanner
            16428, // Sojourner of Azure Span
            16363, // Just Don't Ask Me to Spell It
            16398, // Sojourner of Thaldraszus

            16808, // Friend of the Dragon Isles

            19463, // Dragon Quests
            16683, // In Tyr's Footsteps
            19507, // Fringe Benefits

            19466, // Oh My God, They Were Clutchmates
            16522, // A True Explorer
            16528, // Joining the Khansguard
            16529, // Joining the Community
            16530, // Ally of the Flights
            17763, // There's No Place Like Loamm
            19230, // [1] Friends in the Dream
            19235, // [2] Warden of the Dream
            18615, // Legend of the Multiverse
            16494, // Loyalty to the Prince
            16760, // The Obsidian Bloodline
            16539, // In High Esteem
            16537, // Maximum Power!
            17427, // Winterpelt Conversationalist

            19307, // Dragon Isles Pathfinder
            17739, // Embers of Neltharion
            16761, // Dragon Isles Explorer
            17766, // Explore Zaralek Cavern
            19309, // Explore the Emerald Dream

            // UGH
            19486, // Across the Isles

            19479, // Wake Me Up
            16572, // [1] Legendary Photograph
            16573, // [2] Legendary Photographs
            16570, // [3] A Legendary Album
            16566, // [1] Great Shot!
            16567, // [2] A Lot of Great Shots!
            16568, // [3] Great Shots Galore!
            16587, // Lead Climber
            16588, // How Did These Get Here?
            15890, // Dragonscale Expedition: The Highest Peaks
            16571, // Well Supplied
            16676, // Adventurer of The Waking Shores
            16297, // Treasures of The Waking Shores

            19481, // Centaur of Attention
            16540, // Hunt Master
            16541, // Longhunter
            16545, // The Best at What I Do
            16542, // The Disgruntled Hunter
            16543, // Tetrachromancer
            16424, // Who's a Good Bakar?
            16677, // Adventurer of the Ohn'ahran Plains
            16299, // Treasures of the Ohn'ahran Plains

            19482, // Army of the Fed
            16443, // Soupervisor
            16444, // Leftovers' Revenge
            16317, // Secret Fishing Spots
            16553, // Taking From Nature
            16546, // [1] What's Down There?
            16562, // [2] That's not a Fish...
            16563, // [3] We're Going to Need a Bigger Harpoon
            16580, // Lend a Helping Span
            16678, // Adventurer of The Azure Span
            16300, // Treasures of The Azure Span

            19483, // Fight Club
            16411, // Siege on Dragonbane Keep: Home Sweet Home
            16410, // Siege on Dragonbane Keep: Snack Attack
            16412, // Siege on Dragonbane Keep: Chiseled Record
            16497, // I'm Playing All Sides
            16495, // Obsidian Keymaster
            16496, // Obsidian Champion
            18384, // Whelp, There It Is
            17782, // Daycare Derby
            18383, // Hey Nanny Nanny
            16679, // Adventurer of Thaldraszus
            16301, // Treasures of Thaldraszus

            19485, // Closing Time
            17342, // The Future We Make
            18635, // Verified Rifter
            18637, // Chronograde Connoisseur
            18636, // Just Following Chronological Orders
            18638, // Minute Menagerie
            18639, // Collapsed Reality
            18640, // Lock and Load
            18641, // To All The Squirrels I've BEEN Before
            18703, // Dawn of the Infinite: Galakrond's Fall
            18704, // Dawn of the Infinite: Murozond's Rise

            16492, // Into the Storm
            16490, // Into the Storm > Storm Chaser
            16468, // Into the Storm > Storm Chaser > Chasing Storms in The Waking Shores
            16463, // Into the Storm > Storm Chaser > Chasing Storms in The Waking Shores > Thunderstorms
            16465, // Into the Storm > Storm Chaser > Chasing Storms in The Waking Shores > Sandstorms
            16466, // Into the Storm > Storm Chaser > Chasing Storms in The Waking Shores > Firestorms
            16467, // Into the Storm > Storm Chaser > Chasing Storms in The Waking Shores > Snowstorms
            16476, // Into the Storm > Storm Chaser > Chasing Storms in the Ohn'ahran Plains
            16475, // Into the Storm > Storm Chaser > Chasing Storms in the Ohn'ahran Plains > Thunderstorms
            16477, // Into the Storm > Storm Chaser > Chasing Storms in the Ohn'ahran Plains > Sandstorms
            16478, // Into the Storm > Storm Chaser > Chasing Storms in the Ohn'ahran Plains > Firestorms
            16479, // Into the Storm > Storm Chaser > Chasing Storms in the Ohn'ahran Plains > Snowstorms
            16484, // Into the Storm > Storm Chaser > Chasing Storms in The Azure Span
            16480, // Into the Storm > Storm Chaser > Chasing Storms in The Azure Span > Thunderstorms
            16481, // Into the Storm > Storm Chaser > Chasing Storms in The Azure Span > Sandstorms
            16482, // Into the Storm > Storm Chaser > Chasing Storms in The Azure Span > Firestorms
            16483, // Into the Storm > Storm Chaser > Chasing Storms in The Azure Span > Snowstorms
            16489, // Into the Storm > Storm Chaser > Chasing Storms in Thaldraszus
            16485, // Into the Storm > Storm Chaser > Chasing Storms in Thaldraszus > Thunderstorms
            16486, // Into the Storm > Storm Chaser > Chasing Storms in Thaldraszus > Sandstorms
            16487, // Into the Storm > Storm Chaser > Chasing Storms in Thaldraszus > Firestorms
            16488, // Into the Storm > Storm Chaser > Chasing Storms in Thaldraszus > Snowstorms
            16461, // Into the Storm > Stormed Off
            16498, // Into the Storm > [1] Elemental Overflow
            16499, // Into the Storm > [2] Elemental Overflowing
            16500, // Into the Storm > [3] Elemental Overload
            16502, // Into the Storm > Storming the Runway

            18209, // Nothing Stops the Research
            18867, // Through the Ashes and Flames
            19008, // Dream Shaper
            // END UGH

            17543, // You Know How to Reach Me
            17534, // Explore the Forbidden Reach
            17526, // Treasures of the Forbidden Reach
            17527, // [1] Scavenger of the Forbidden Reach
            17528, // [2] Hoarder of the Forbidden Reach
            17524, // [1] Adventurer of the Forbidden Reach
            17525, // [2] Champion of the Forbidden Reach
            17529, // Forbidden Spoils
            17530, // Librarian of the Reach
            17531, // [1] X Marks the Spot
            17532, // [2] Scroll Hunter
            17540, // Under the Weather
            17397, // [1] Door To Door
            17413, // [2] Door Buster
            17509, // Every Door, Everywhere, All At Once
            17315, // While We Were Sleeping

            17785, // Que Zara(lek), Zara(lek)
            17783, // Adventurer of Zaralek Cavern
            17781, // The Smell of Money
            // 17766, // Explore Zaralek Cavern (above)
            // 17763, // There's No Place Like Loamm (above)
            17786, // Treasures of Zaralek Cavern
            17832, // Sniffen Around
            17830, // Stones Can't Fly!

            19318, // Dream On
            19026, // Defenders of the Dream
            19316, // Adventurer of the Emerald Dream
            19317, // Treasures of the Emerald Dream
            19013, // I Dream of Seeds
            // 19309, // Explore the Emerald Dream
            19312, // Super Duper Bloom

            // UGH
            19478, // Now THIS is Dragon Racing!

            15939, // Dragon Racing Completionist: Bronze
            15915, // Waking Shores: Bronze
            15918, // Ohn'ahran Plains: Bronze
            15921, // Azure Span: Bronze
            15924, // Thaldraszus: Bronze
            15927, // Waking Shores Advanced: Bronze
            15930, // Ohn'ahran Plains Advanced: Bronze
            15933, // Azure Span Advanced: Bronze
            15936, // Thaldraszus Advanced: Bronze

            17294, // Forbidden Reach Racing Completionist
            17279, // Forbidden Reach: Bronze
            17284, // Forbidden Reach Advanced: Bronze
            17288, // Forbidden Reach Reverse: Bronze

            17492, // Zaralek Cavern Racing Completionist
            17483, // Zaralek Cavern: Bronze
            17486, // Zaralek Cavern Advanced: Bronze
            17489, // Zaralek Cavern Reverse: Bronze

            19118, // Emerald Dream Racing Completionist
            19109, // Emerald Dream: Bronze
            19112, // Emerald Dream Advanced: Bronze
            19115, // Emerald Dream Reverse: Bronze

            16575, // Waking Shores Glyph Hunter
            16576, // Ohn'ahran Plains Glyph Hunter
            16577, // Azure Span Glyph Hunter
            16578, // Thaldraszus Glyph Hunter
            17411, // Forbidden Reach Glyph Hunter
            18150, // Zaralek Cavern Glyph Hunter
            19306, // Emerald Dream Glyph Hunter
            // END UGH
        ],
        children: [],
    });

    // TWW hack
    ret.categories.push({
        id: categoryId++,
        name: '[TWW] Worldsoul-Searching',
        slug: 'worldsoul-searching',
        achievementIds: [
            19458, // Worldsoul-Searching

            40244, // Nerub-ar Palace
            41222, // Liberation of Undermine
            41598, // Manaforge Omega

            41555, // All That Khaz
            40430, // All That Khaz > Khaz Algar Flight Master

            40702, // All That Khaz > Khaz Algar Glyph Hunter
            40166, // All That Khaz > Khaz Algar Glyph Hunter > Isle of Dorn Glyph Hunter
            40703, // All That Khaz > Khaz Algar Glyph Hunter > The Ringing Deeps Glyph Hunter
            40704, // All That Khaz > Khaz Algar Glyph Hunter > Hallowfall Glyph Hunter
            40705, // All That Khaz > Khaz Algar Glyph Hunter > Azj-Kahet Glyph Hunter

            20596, // All That Khaz > Loremaster of Khaz Algar
            20118, // All That Khaz > Loremaster of Khaz Algar > The Isle of Dorn
            19560, // All That Khaz > Loremaster of Khaz Algar > The Ringing Deeps
            20598, // All That Khaz > Loremaster of Khaz Algar > Hallowfall
            19559, // All That Khaz > Loremaster of Khaz Algar > Azj-Kahet
            20595, // All That Khaz > Loremaster of Khaz Algar > Sojourner of Isle of Dorn
            40799, // All That Khaz > Loremaster of Khaz Algar > Sojourner of The Ringing Deeps
            40844, // All That Khaz > Loremaster of Khaz Algar > Sojourner of Hallowfall
            40636, // All That Khaz > Loremaster of Khaz Algar > Sojourner of Azj-Kahet

            40762, // All That Khaz > Khaz Algar Lore Hunter
            41169, // All That Khaz > Khaz Algar Diplomat
            40307, // All That Khaz > Allied Races: Earthen

            41201, // You Xal Not Pass

            41186, // You Xal Not Pass > Slate of the Union

            41187, // You Xal Not Pass > Rage Aside the Machine

            41188, // You Xal Not Pass > Crystal Chronicled

            41189, // You Xal Not Pass > Azj the World Turns

            41133, // You Xal Not Pass > Isle Remember You

            40231, // The War Within Pathfinder
            20118, // The War Within Pathfinder > The Isle of Dorn
            19560, // The War Within Pathfinder > The Ringing Deeps
            20598, // The War Within Pathfinder > Hallowfall
            19559, // The War Within Pathfinder > Azj-Kahet
            40790, // The War Within Pathfinder > Khaz Algar Explorer

            // Glory of the Delver
            40438, // Glory of the Delver

            40537, // Glory of the Delver > Delve Loremaster: War Within
            //???

            40506, // Glory of the Delver > Leave No Treasure Unfound
            // ???

            40445, // Glory of the Delver > Sporesweeper
            40453, // Glory of the Delver > Spider Senses
            40454, // Glory of the Delver > Daystormer
            40538, // Glory of the Delver > Brann Development
            [
                40103, // Glory of the Delver > My First Nemesis
                41530, // Glory of the Delver > My New Nemesis
                42193, // Glory of the Delver > My Stab-Happy Nemesis
            ],

            // Going Goblin Mode
            41586, // Going Goblin Mode
            41216, // Going Goblin Mode > Adventurer of Undermine
            41217, // Going Goblin Mode > Treasures of Undermine
            40948, // Going Goblin Mode > Nine-Tenths of the Law
            41588, // Going Goblin Mode > Read Between the Lines
            41589, // Going Goblin Mode > That Can-Do Attitude
            41708, // Going Goblin Mode > You're My Friend Now

            41997, // Owner of a Radiant Heart

            // Unraveled and Persevering
            60889, // Unraveled and Persevering
            42761, // Unraveled and Persevering > Remnants of a Shattered World
            42741, // Unraveled and Persevering > Treasures of K'aresh
            42740, // Unraveled and Persevering > Explore K'aresh
            41979, // Unraveled and Persevering > Bounty Seeker
            42729, // Unraveled and Persevering > Dangerous Prowlers of K'aresh
            42742, // Unraveled and Persevering > Power of the Reshii
            50890, // Unraveled and Persevering > Secrets of the K'areshi
        ],
        children: [],
    });

    for (const category of ret.categories.filter((cat) => cat?.id >= 100000)) {
        for (const maybeArray of category.achievementIds) {
            if (Array.isArray(maybeArray)) {
                for (const achievementId of maybeArray) {
                    ret.achievementToCategory[achievementId] ||= category.id;
                }
            } else {
                ret.achievementToCategory[maybeArray] ||= category.id;
            }
        }
    }

    console.timeEnd('processAchievementsData');
    return ret;
}
