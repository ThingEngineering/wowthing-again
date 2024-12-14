import find from 'lodash/find';

import { extraCategories, forceSupersededBy, forceSupersedes } from '@/data/achievements';
import {
    AchievementDataAchievement,
    AchievementDataCriteria,
    AchievementDataCriteriaTree,
    type AchievementDataCategory,
} from '@/types/achievement-data';
import type { AchievementData } from '@/types/achievement-data';
import { WritableFancyStore } from '@/types/fancy-store';

export class AchievementDataStore extends WritableFancyStore<AchievementData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-achievements');
    }

    initialize(data: AchievementData): void {
        console.time('AchievementData.initialize');

        data.achievement = {};
        for (const rawAchievement of data.achievementRaw) {
            const obj = new AchievementDataAchievement(...rawAchievement);

            if (forceSupersedes[obj.id]) {
                obj.supersedes = forceSupersedes[obj.id];
            }
            if (forceSupersededBy[obj.id]) {
                obj.supersededBy = forceSupersededBy[obj.id];
            }

            data.achievement[obj.id] = obj;
        }
        data.achievementRaw = null;

        data.criteria = {};
        for (const rawCriteria of data.criteriaRaw) {
            const obj = new AchievementDataCriteria(...rawCriteria);
            data.criteria[obj.id] = obj;
        }
        data.criteriaRaw = null;

        data.criteriaTree = {};
        for (const rawCriteriaTree of data.criteriaTreeRaw) {
            const obj = new AchievementDataCriteriaTree(...rawCriteriaTree);
            data.criteriaTree[obj.id] = obj;
        }
        data.criteriaTreeRaw = null;

        data.isHidden = {};
        for (const achievementId of data.hideIds) {
            data.isHidden[achievementId] = true;
        }
        data.hideIds = null;

        data.categories.push(null);
        let categoryId = 100000;
        for (const extraCategory of extraCategories) {
            const reputations = data.categories.find((cat) => cat?.slug === 'reputation');
            const slugCat = reputations?.children.find(
                (child) => child.slug === extraCategory.slug,
            );
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
                const childCat1 = find(data.categories, (c) => c !== null && c.slug === childSlug1);
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
                        achievementIds: (child.achievementIds || []).concat(
                            childCat2.achievementIds,
                        ),
                        children: [],
                    });
                } else {
                    console.log('womp womp', childSlug1, childSlug2);
                }
            }

            data.categories.push(category);
        }

        data.categories.push(null);

        categoryId = 200000;
        // BfA hack
        data.categories.push({
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
                12087, // \--- The Reining Champion
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
        data.categories.push({
            id: categoryId++,
            name: '[BfA] Undersea Usurper',
            slug: 'undersea-usurper',
            achievementIds: [
                13638, // Undersea Usurper

                13635, // Tour of the Depths
                13690, // Nazjatarget Eliminated
                13691, // I Thought You Said They'd Be Rare?

                13704, // [A] Nautical Battlefield Training
                13762, // [A] Aqua Team Murder Force
                13744, // Seasoned: Bladesman Inowari
                13754, // Veteran: Bladesman Inowari
                13759, // Battle-Scarred: Bladesman Inowari
                13745, // Seasoned: Farseer Ori
                13755, // Veteran: Farseer Ori
                13760, // Battle-Scarred: Farseer Ori
                13743, // Seasoned: Hunter Akana
                13753, // Veteran: Hunter Akana
                13758, // Battle-Scarred: Hunter Akana

                13645, // [H] Nautical Battlefield Training
                13761, // [H] Aqua Team Murder Force
                13746, // Seasoned: Neri Sharpfin
                13749, // Veteran: Neri Sharpfin
                13750, // Battle-Scarred: Neri Sharpfin
                13747, // Seasoned: Poen Gillbrack
                13751, // Veteran: Poen Gillbrack
                13756, // Battle-Scarred: Poen Gillbrack
                13748, // Seasoned: Vim Brineheart
                13752, // Veteran: Vim Brineheart
                13757, // Battle-Scarred: Vim Brineheart

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
        data.categories.push({
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
        data.categories.push({
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

        data.achievementToCategory = {};
        for (const category of data.categories.filter((cat) => cat?.id >= 100000)) {
            for (const maybeArray of category.achievementIds) {
                if (Array.isArray(maybeArray)) {
                    for (const achievementId of maybeArray) {
                        data.achievementToCategory[achievementId] ||= category.id;
                    }
                } else {
                    data.achievementToCategory[maybeArray] ||= category.id;
                }
            }
        }

        console.timeEnd('AchievementData.initialize');
    }
}

export const achievementStore = new AchievementDataStore();
