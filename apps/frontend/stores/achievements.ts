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
        for (const [baseSlug, children] of extraCategories) {
            const slugCat = find(data.categories[6].children, (c) => c.slug === baseSlug);
            if (!slugCat) {
                console.log('uh oh', baseSlug);
                continue;
            }

            const category: AchievementDataCategory = {
                id: categoryId++,
                name: slugCat.name,
                slug: slugCat.slug,
                achievementIds: [],
                children: [],
            };

            for (const child of children) {
                if (child === null) {
                    category.children.push(null);
                    continue;
                }

                const [childSlug, childNameType, childSlugOverride, childNameOverride] = child;

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
                        achievementIds: childCat2.achievementIds,
                        children: [],
                    });
                } else {
                    console.log('womp womp', childSlug1, childSlug2);
                }
            }

            data.categories.push(category);
        }

        // DF hack
        data.categories.push(null);
        data.categories.push({
            id: categoryId,
            name: 'A World Awoken',
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
                19235, // Warden of the Dream
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
                16570, // A Legendary Album
                16568, // Great Shots Galore!
                16587, // Lead Climber
                16588, // How Did These Get Here?
                15890, // Dragonscale Expedition: The Highest Peaks
                16571, // Well Supplied
                16676, // Adventurer of The Waking Shores
                16297, // Treasures of The Waking Shores

                19481, // Centaur of Attention

                19482, // Army of the Fed
                16443, // Soupervisor
                16444, // Leftovers' Revenge
                16317, // Secret Fishing Spots
                16553, // Taking From Nature
                16563, // We're Going to Need a Bigger Harpoon
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
                16490, // Storm Chaser
                16461, // Stormed Off
                16500, // Elemental Overload
                16502, // Storming the Runway

                18209, // Nothing Stops the Research
                18867, // Through the Ashes and Flames
                19008, // Dream Shaper
                // END UGH

                17543, // You Know How to Reach Me
                17534, // Explore the Forbidden Reach
                17526, // Treasures of the Forbidden Reach
                17528, // Hoarder of the Forbidden Reach
                17525, // Champion of the Forbidden Reach
                17529, // Forbidden Spoils
                17530, // Librarian of the Reach
                17532, // Scroll Hunter
                17540, // Under the Weather
                17413, // Door Buster
                17509, // Every Door, Everywhere, All At Once
                17315, // While We Were Sleeping

                17785, // Que Zara(lek), Zara(lek)
                17783, // Adventurer of Zaralek Cavern
                17781, // The Smell of Money
                // 17766, // Explore Zaralek Cavern
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

        // SL hack
        data.categories.push({
            id: categoryId,
            name: 'Back from the Beyond',
            slug: 'back-from-the-beyond',
            achievementIds: [
                20501, // Back from the Beyond

                14715, // Castle Nathria
                14961, // Chains of Domination
                15647, // Dead Men Tell Some Tales
                15178, // Fake It 'Til You Make It

                15336, // From A to Zereth
                15331, // Treasures of Zereth Mortis
                15392, // Dune Dominance
                15391, // Adventurer of Zereth Mortis
                15402, // Cyphers of the First Ones
                15407, // Synthe-fived!
                15220, // The Enlightened

                15079, // Many, Many Things
                15651, // Myths of the Shadowland Dungeons
                15035, // On the Offensive
                15646, // Re-Re-Re-Renowned
                15025, // Sanctum Superior
                15126, // Sanctum of Domination
                15259, // Secrets of the First Ones
                15417, // Sepulcher of the First Ones

                15649, // Shadowlands Dilettante
                14502, // Pursuing Loyalty
                14723, // Be Our Guest
                14752, // Things To Do When You're Dead
                14684, // Abominable Lives
                14751, // The Gang's All Here
                14748, // Wardrobe Makeover
                14753, // It's a Wrap
                14775, // Mush Appreciated

                15324, // Tower Ranger
                15322, // Flawless Master (Layer 16)
                15067, // Adamant Vaults
                14570, // Twisting Corridors: Layer 8
                15254, // The Jailer's Gauntlet: Layer 4
                15092, // Master of Torment
                15093, // Avenge Me!
                15095, // No Doubt
                15094, // Rampage
                15096, // Crowd Pleaser

                15648, // Walking in Maw-mphis
                14895, // 'Ghast Five
                14744, // Better to Be Lucky Than Dead
                14660, // It's About Sending a Message
                14738, // Hunting Party
                14656, // Trading Partners
                14658, // Soulkeeper's Burden
                14663, // Explore The Maw
            ],
            children: [],
        });

        console.timeEnd('AchievementData.initialize');
    }
}

export const achievementStore = new AchievementDataStore();
