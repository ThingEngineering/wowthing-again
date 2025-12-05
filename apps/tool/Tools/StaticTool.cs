using Serilog.Context;
using Serilog.Core;
using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Enums;
using Wowthing.Tool.Models;
using Wowthing.Tool.Models.Artifacts;
using Wowthing.Tool.Models.Covenants;
using Wowthing.Tool.Models.Heirlooms;
using Wowthing.Tool.Models.Housing;
using Wowthing.Tool.Models.Journal;
using Wowthing.Tool.Models.Professions;
using Wowthing.Tool.Models.Quests;
using Wowthing.Tool.Models.Spells;
using Wowthing.Tool.Models.Static;
using Wowthing.Tool.Models.Traits;
using Wowthing.Tool.Models.Transmog;

namespace Wowthing.Tool.Tools;

public class StaticTool
{
    private readonly JankTimer _timer = new();

    private Dictionary<int, WowItem> _itemMap = null!;
    private StaticProfessionReagents _reagents;
    private Dictionary<(StringType Type, Language Language, int Id), string> _stringMap = null!;

    private static readonly StringType[] StringTypes = [
        StringType.WowCampaignName,
        StringType.WowChallengeDungeonName,
        StringType.WowCharacterClassName,
        StringType.WowCharacterRaceName,
        StringType.WowCharacterSpecializationName,
        StringType.WowCharacterTitle,
        StringType.WowCreatureName,
        StringType.WowCurrencyCategoryName,
        StringType.WowCurrencyDescription,
        StringType.WowCurrencyName,
        StringType.WowDecorCategoryName,
        StringType.WowDecorObjectName,
        StringType.WowDecorSubcategoryName,
        StringType.WowHolidayName,
        StringType.WowInventorySlot,
        StringType.WowInventoryType,
        StringType.WowItemName,
        StringType.WowKeystoneAffixName,
        StringType.WowMountName,
        StringType.WowQuestLineName,
        StringType.WowQuestName,
        StringType.WowReputationDescription,
        StringType.WowReputationName,
        StringType.WowReputationTier,
        StringType.WowSharedString,
        StringType.WowSoulbindName,
        StringType.WowSkillLineName,
        StringType.WowSpellItemEnchantmentName,
        StringType.WowSpellName,
        StringType.WowTransmogSetName,
    ];

    private static readonly Dictionary<string, string> HolidayMap = new()
    {
        { "Brewfest", "holidayBrewfest" },
        { "Darkmoon Faire", "holidayDarkmoonFaire" },
        { "Feast of Winter Veil", "holidayWinterVeil" },
        { "Hallow's End", "holidayHallowsEnd" },
        { "Love is in the Air", "holidayLoveIsInTheAir" },
        { "Lunar Festival", "holidayLunarFestival" },
        { "Midsummer Fire Festival", "holidayMidsummerFireFestival" },
        { "Noblegarden", "holidayNoblegarden" },
        { "Pilgrim's Bounty", "holidayPilgrimsBounty" },
        // not holidays but too much effort to fix now
        { "Arena Skirmish Bonus Event", "holidayArena" },
        { "Battleground Bonus Event", "holidayBattlegrounds" },
        { "Delves Bonus Event", "holidayDelves"},
        { "Pet Battle Bonus Event", "holidayPetPvp" },
        { "World Quest Bonus Event", "holidayWorldQuests" },
    };

    private static readonly HashSet<int> TimewalkingRaidIds = [
        559, 622, 623, 624, // TBC: Black Temple
        562, 616, 617, 618, // WotLK: Ulduar
        587, 628, 629, 630, // Cata: Firelands
    ];

    public async Task Run()
    {
        using var foo = LogContext.PushProperty("Task", "Static");
        await using var context = ToolContext.GetDbContext();

        var db = ToolContext.Redis.GetDatabase();
        var cacheData = new RedisStaticData();

        ToolContext.Logger.Information("Loading data...");

        // Bulk data
        _itemMap = await context.WowItem
            .AsNoTracking()
            .ToDictionaryAsync(item => item.Id);

        var mountMap = await context.WowMount
            .AsNoTracking()
            .ToDictionaryAsync(mount => mount.Id);

        var petMap = await context.WowPet
            .AsNoTracking()
            .Where(pet => (pet.Flags & 32) == 0)
            .ToDictionaryAsync(pet => pet.Id);

        var toyMap = await context.WowToy
            .AsNoTracking()
            .ToDictionaryAsync(toy => toy.ItemId);

        var transmogSetMap = await context.WowTransmogSet
            .AsNoTracking()
            .ToDictionaryAsync(transmogSet => transmogSet.Id);

        _stringMap = await context.LanguageString
            .AsNoTracking()
            .Where(ls => StringTypes.Contains(ls.Type))
            .ToDictionaryAsync(
                ls => (ls.Type, ls.Language, ls.Id),
                ls => ls.String
            );

        var itemModifiedAppearances = await context.WowItemModifiedAppearance
            .AsNoTracking()
            .ToArrayAsync();

        var imaMap = itemModifiedAppearances.ToDictionary(ima => ima.Id);

        _timer.AddPoint("Bulk");

        // Bags
        cacheData.RawBags = _itemMap.Values
            .Where(item => item.ContainerSlots > 0)
            .Select(item => new List<int> { item.Id, (int)item.Quality, item.ContainerSlots })
            .ToList();

        // Character stuff
        cacheData.CharacterClasses = await context.WowCharacterClass
            .AsNoTracking()
            .OrderBy(cls => cls.Id)
            .ToDictionaryAsync(
                cls => cls.Id,
                cls => new StaticCharacterClass(cls)
            );

        cacheData.CharacterRaces = await context.WowCharacterRace
            .AsNoTracking()
            .OrderBy(race => race.Id)
            .ToDictionaryAsync(
                race => race.Id,
                race => new StaticCharacterRace(race)
                {
                    Slug = GetString(StringType.WowCharacterRaceName, Language.enUS, race.Id).Slugify(),
                }
            );

        cacheData.CharacterSpecializations = await context.WowCharacterSpecialization
            .AsNoTracking()
            .Where(spec => spec.Order < 4)
            .OrderBy(spec => spec.Id)
            .ToDictionaryAsync(
                spec => spec.Id,
                spec => new StaticCharacterSpecialization(spec)
            );

        _timer.AddPoint("Character");

        // Challenge Dungeons

        cacheData.RawChallengeDungeons = await context.WowChallengeDungeon
            .AsNoTracking()
            .OrderBy(dungeon => dungeon.Id)
            .Select(dungeon => new StaticChallengeDungeon(dungeon))
            .ToArrayAsync();

        // Currencies
        cacheData.RawCurrencies = await context.WowCurrency
            .AsNoTracking()
            .Where(currency => !Hardcoded.IgnoredCurrencies.Contains(currency.Id))
            .OrderBy(currency => currency.Id)
            .Select(currency => new StaticCurrency(currency))
            .ToArrayAsync();

        cacheData.RawCurrencyCategories = await context.WowCurrencyCategory
            .AsNoTracking()
            .OrderBy(category => category.Id)
            .Select(category => new StaticCurrencyCategory(category))
            .ToArrayAsync();

        foreach (var category in cacheData.RawCurrencyCategories)
        {
            category.Slug = GetString(StringType.WowCurrencyCategoryName, Language.enUS, category.Id).Slugify();
        }

        _timer.AddPoint("Currencies");

        // Decor
        cacheData.RawDecor = await LoadDecor();

        foreach (var category in cacheData.RawDecor)
        {
            category.Slug = GetString(StringType.WowDecorCategoryName, Language.enUS, category.Id).Slugify();
            foreach (var subCategory in category.Subcategories)
            {
                subCategory.Slug = GetString(StringType.WowDecorSubcategoryName, Language.enUS, subCategory.Id).Slugify();
            }
        }

        // Enchantments
        cacheData.EnchantmentValues = await LoadEnchantmentValues();

        // Heirlooms
        cacheData.Heirlooms = await LoadHeirlooms();
        _timer.AddPoint("Heirlooms");

        // Holidays
        cacheData.RawHolidays = await context.WowHoliday
            .Where(holiday => holiday.Region == 0 || (holiday.Region & 31) != 0)
            .OrderBy(holiday => holiday.Id)
            .Select(holiday => new StaticHoliday(holiday))
            .ToArrayAsync();

        cacheData.HolidayIds = new()
        {
            { "holidayDungeons", new() },
            { "holidayTimewalking", new() },
            { "holidayTimewalkingItem", new() },
            { "holidayTimewalkingRaid", new() },
            { "pvpBrawl", new() },
        };

        foreach (var holiday in cacheData.RawHolidays)
        {
            string holidayName = GetString(StringType.WowHolidayName, Language.enUS, holiday.Id);
            if (HolidayMap.TryGetValue(holidayName, out string holidayKey))
            {
                if (!cacheData.HolidayIds.TryGetValue(holidayKey, out var keyIds))
                {
                    keyIds = cacheData.HolidayIds[holidayKey] = new();
                }

                keyIds.Add(holiday.Id);
            }
            else if (holidayName == "Timewalking Dungeon Event")
            {
                cacheData.HolidayIds["holidayTimewalking"].Add(holiday.Id);
                cacheData.HolidayIds["holidayTimewalkingItem"].Add(holiday.Id);
                if (TimewalkingRaidIds.Contains(holiday.Id))
                {
                    cacheData.HolidayIds["holidayTimewalkingRaid"].Add(holiday.Id);
                }
            }
            else if (holidayName.StartsWith("PvP Brawl"))
            {
                cacheData.HolidayIds["pvpBrawl"].Add(holiday.Id);
            }
            else if (holidayName.EndsWith("Dungeon Event"))
            {
                cacheData.HolidayIds["holidayDungeons"].Add(holiday.Id);
            }
        }

        _timer.AddPoint("Holidays");

        // Illusions
        cacheData.Illusions = await LoadIllusions();
        _timer.AddPoint("Illusions");

        // Instances
        cacheData.InstancesRaw = await LoadInstances();
        _timer.AddPoint("Instances");

        // Keystone Affixes
        var affixMaps = _stringMap
            .Where(kvp => kvp.Key.Type == StringType.WowKeystoneAffixName)
            .GroupBy(kvp => kvp.Key.Language)
            .ToDictionary(
                group => group.Key,
                group => group.ToDictionary(
                    kvp => kvp.Key.Id,
                    kvp => kvp.Value
            ));
        cacheData.KeystoneAffixes = affixMaps[Language.enUS]
            .Select(kvp => new StaticKeystoneAffix(kvp.Key, kvp.Value))
            .ToDictionary(ska => ska.Id);

        // Traits
        var traits = await LoadTraits();
        _timer.AddPoint("Traits");

        // Professions
        _reagents = await LoadProfessionReagents();
        var professions = await LoadProfessions(traits);

        cacheData.ItemToRequiredAbility = _itemMap.Values
            .Where(item => item.RequiredAbility > 0)
            .ToDictionary(
                item => item.Id,
                item => item.RequiredAbility
            );
        cacheData.ReagentCategories = _reagents.Categories;

        foreach (var kvp in Hardcoded.ItemToRequiredAbility)
        {
            if (cacheData.ItemToRequiredAbility.ContainsKey(kvp.Key))
            {
                ToolContext.Logger.Warning("ItemToRequiredAbility already exists: {key} {value}", kvp.Key, kvp.Value);
            }
            else
            {
                cacheData.ItemToRequiredAbility.Add(kvp.Key, kvp.Value);
            }
        }

        cacheData.ItemToSkillLine = _itemMap.Values
            .Where(item => item.RequiredSkill > 0)
            .ToDictionary(
                item => item.Id,
                item => new[] { item.RequiredSkill, item.RequiredSkillRank }
            );

        cacheData.SkillLineAbilityItems = (await context.WowProfessionRecipeItem.ToArrayAsync())
            .GroupBy(wpri => wpri.SkillLineAbilityId)
            .ToDictionary(
                group => group.Key,
                group => group.Select(wpri => wpri.ItemId).ToArray());

        _timer.AddPoint("Professions");

        // Reputations
        var reputations = await context.WowReputation
            .AsNoTracking()
            .OrderBy(rep => rep.Id)
            .ToArrayAsync();

        _timer.AddPoint("Reputations");

        // Soulbinds
        var soulbinds = await LoadSoulbinds();
        _timer.AddPoint("Soulbinds");

        // Talents
        //cacheData.Talents = await LoadTalents();
        _timer.AddPoint("Talents");

        // Basic database dumps
        cacheData.RawRealms = await context.WowRealm
            .AsNoTracking()
            .Where(realm => realm.Name != null && !EF.Functions.ILike(realm.Slug, "%-ps-realm-%"))
            .OrderBy(realm => realm.Id)
            .ToListAsync();

        cacheData.ReputationTiers = new SortedDictionary<int, StaticReputationTier>(
            await context.WowReputationTier
                .AsNoTracking()
                .ToDictionaryAsync(
                    tier => tier.Id,
                    tier => new StaticReputationTier(tier)
                )
        );

        _timer.AddPoint("Load");

        // Initial object creation
        cacheData.RawReputations = reputations.Select(rep => new StaticReputation(rep))
            .ToArray();

        cacheData.RawMounts = mountMap
            .Values
            .OrderBy(mount => mount.Id)
            .Select(mount => new StaticMount(mount))
            .ToArray();

        cacheData.RawPets = petMap
            .Values
            .OrderBy(pet => pet.Id)
            .Select(pet => new StaticPet(pet))
            .ToArray();

        cacheData.RawToys = toyMap
            .Values
            .OrderBy(toy => toy.Id)
            .Select(toy => new StaticToy(toy))
            .ToArray();

        cacheData.RawTransmogSets = transmogSetMap
            .Values
            .OrderBy(transmogSet => transmogSet.Id)
            .Select(transmogSet => new StaticTransmogSet(transmogSet, imaMap))
            .ToArray();

        cacheData.RawCampaigns = await context.WowCampaign
            .OrderBy(campaign => campaign.Id)
            .Select(campaign => new StaticCampaign(campaign))
            .ToArrayAsync();

        cacheData.RawQuestLines = await context.WowQuestLine
            .OrderBy(ql => ql.Id)
            .Select(ql => new StaticQuestLine(ql))
            .ToArrayAsync();

        cacheData.RawWorldQuests = await context.WowWorldQuest
            .OrderBy(wq => wq.Id)
            .Select(wq => new StaticWorldQuest(wq))
            .ToArrayAsync();

        _timer.AddPoint("Objects");

        // Add anything that uses strings
        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {lang}...", language);

            cacheData.Artifacts = await LoadArtifacts(language);
            cacheData.RawQuestInfo = await LoadQuestInfo(language);

            cacheData.RawProfessions = professions[language];
            cacheData.Soulbinds = soulbinds[language];

            cacheData.EnchantmentStrings = _stringMap
                .Where(kvp =>
                    kvp.Key.Type == StringType.WowSpellItemEnchantmentName
                    && kvp.Key.Language == language
                    && !string.IsNullOrWhiteSpace(kvp.Value)
                )
                .ToGroupedDictionary(
                    kvp => kvp.Value,
                    kvp => kvp.Key.Id
                );

            cacheData.InventorySlots = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowInventorySlot && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.InventoryTypes = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowInventoryType && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.QuestNames = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowQuestName &&
                              kvp.Key.Language == language &&
                              kvp.Value != "~PLACEHOLDER~" &&
                              kvp.Value != "~NOTFOUND~")
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.SharedStrings = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowSharedString && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            cacheData.Titles = _stringMap
                .Where(kvp => kvp.Key.Type == StringType.WowCharacterTitle && kvp.Key.Language == language)
                .ToDictionary(kvp => kvp.Key.Id, kvp => kvp.Value);

            foreach (var characterClass in cacheData.CharacterClasses.Values)
            {
                characterClass.Name = GetString(StringType.WowCharacterClassName, language, characterClass.Id);
            }

            foreach (var characterRace in cacheData.CharacterRaces.Values)
            {
                characterRace.Name = GetString(StringType.WowCharacterRaceName, language, characterRace.Id);
            }

            foreach (var characterSpec in cacheData.CharacterSpecializations.Values)
            {
                characterSpec.Name = GetString(StringType.WowCharacterSpecializationName, language, characterSpec.Id);
            }

            foreach (var illusion in cacheData.Illusions.Values)
            {
                illusion.Name = GetString(StringType.WowSpellItemEnchantmentName, language, illusion.EnchantmentId);
            }

            foreach (var keystoneAffix in cacheData.KeystoneAffixes.Values)
            {
                keystoneAffix.Name = affixMaps[language].GetValueOrDefault(keystoneAffix.Id, affixMaps[Language.enUS][keystoneAffix.Id]);
            }

            foreach (var campaign in cacheData.RawCampaigns)
            {
                campaign.Name = GetString(StringType.WowCampaignName, language, campaign.Id);
            }

            foreach (var dungeon in cacheData.RawChallengeDungeons)
            {
                dungeon.Name = GetString(StringType.WowChallengeDungeonName, language, dungeon.Id);
            }

            foreach (var currency in cacheData.RawCurrencies)
            {
                currency.Description = GetString(StringType.WowCurrencyDescription, language, currency.Id);
                currency.Name = GetString(StringType.WowCurrencyName, language, currency.Id);
            }

            foreach (var currencyCategory in cacheData.RawCurrencyCategories)
            {
                currencyCategory.Name = GetString(StringType.WowCurrencyCategoryName, language, currencyCategory.Id);
            }

            foreach (var decorCategory in cacheData.RawDecor)
            {
                decorCategory.Name = GetString(StringType.WowDecorCategoryName, language, decorCategory.Id);
                foreach (var decorSubcategory in decorCategory.Subcategories)
                {
                    decorSubcategory.Name = GetString(StringType.WowDecorSubcategoryName, language, decorSubcategory.Id);
                }
            }

            foreach (var holiday in cacheData.RawHolidays)
            {
                holiday.Name = GetString(StringType.WowHolidayName, language, holiday.Id);
            }

            foreach (var questLine in cacheData.RawQuestLines)
            {
                questLine.Name = GetString(StringType.WowQuestLineName, language, questLine.Id);
            }

            foreach (var reputation in cacheData.RawReputations)
            {
                reputation.Name = GetString(StringType.WowReputationName, language, reputation.Id);
                reputation.Description = GetString(StringType.WowReputationDescription, language, reputation.Id);
            }

            foreach (var mount in cacheData.RawMounts)
            {
                mount.Name = GetString(StringType.WowMountName, language, mount.Id);
            }

            foreach (var pet in cacheData.RawPets)
            {
                pet.Name = GetString(StringType.WowCreatureName, language, pet.CreatureId);
            }

            foreach (var toy in cacheData.RawToys)
            {
                toy.Name = GetString(StringType.WowItemName, language, toy.ItemId);
            }

            foreach (var transmogSet in cacheData.RawTransmogSets)
            {
                transmogSet.Name = GetString(StringType.WowTransmogSetName, language, transmogSet.Id);
            }

            foreach (var worldQuest in cacheData.RawWorldQuests)
            {
                worldQuest.Name = GetString(StringType.WowQuestName, language, worldQuest.Id);
            }

            foreach (var reputationTier in cacheData.ReputationTiers.Values)
            {
                reputationTier.Names = GetString(StringType.WowReputationTier, language, reputationTier.Id)
                    .Split('|');
            }

            string cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            cacheHash ??= cacheJson.Md5();

            await db.SetCacheDataAndHash($"static-{language.ToString()}", cacheJson, cacheHash);
        }

        _timer.AddPoint("Cache", true);

        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private string GetString(StringType type, Language language, int id)
    {
        if (!_stringMap.TryGetValue((type, language, id), out string languageName))
        {
            languageName = _stringMap.GetValueOrDefault(
                (type, Language.enUS, id), $"{type.ToString()} #{id}");
        }

        return languageName;
    }

    private async Task<List<StaticArtifact>> LoadArtifacts(Language language)
    {
        var ret = new List<StaticArtifact>();

        var artifacts = await DataUtilities.LoadDumpCsvAsync<DumpArtifact>("artifact", language, da => da.ChrSpecializationID > 0);
        var artifactAppearancesBySet =
            (await DataUtilities.LoadDumpCsvAsync<DumpArtifactAppearance>("artifactappearance", language))
            .ToGroupedDictionary(aa => aa.ArtifactAppearanceSetID);
        var artifactAppearanceSetsByArtifact =
            (await DataUtilities.LoadDumpCsvAsync<DumpArtifactAppearanceSet>("artifactappearanceset", language))
            .ToGroupedDictionary(aas => aas.ArtifactID);

        // skipping weird test artifacts
        foreach (var artifact in artifacts.Where(artifact => artifact.ID is not (74 or 80 or 81 or 82)))
        {
            ToolContext.Logger.Information("artifact {id} {name}", artifact.ID, artifact.Name);
            if (!artifactAppearanceSetsByArtifact.TryGetValue(artifact.ID, out var appearanceSets))
            {
                ToolContext.Logger.Warning("- no appearance sets!");
                continue;
            }

            var staticArtifact = new StaticArtifact(artifact.ID, artifact.ChrSpecializationID, artifact.Name);

            foreach (var appearanceSet in appearanceSets.OrderBy(appearanceSet => appearanceSet.DisplayIndex))
            {
                ToolContext.Logger.Information("- set {id} {name}", appearanceSet.ID, appearanceSet.Name);
                if (!artifactAppearancesBySet.TryGetValue(appearanceSet.ID, out var appearances))
                {
                    ToolContext.Logger.Warning("- - no appearances!");
                    continue;
                }

                var staticAppearanceSet = new StaticArtifactAppearanceSet(appearanceSet.Name);

                var seenModifiers = new HashSet<int>();
                foreach (var appearance in appearances.OrderBy(appearance => appearance.DisplayIndex))
                {
                    ToolContext.Logger.Information("- - appearance {id} {name} => modifier {mod}", appearance.ID, appearance.Name, appearance.ItemAppearanceModifierID);

                    if (!seenModifiers.Add(appearance.ItemAppearanceModifierID))
                    {
                        continue;
                    }

                    staticAppearanceSet.Appearances.Add(new StaticArtifactAppearance(
                        appearance.ID,
                        appearance.ItemAppearanceModifierID,
                        appearance.UiSwatchColor,
                        appearance.Name
                    ));
                }

                staticArtifact.AppearanceSets.Add(staticAppearanceSet);
            }

            ret.Add(staticArtifact);
        }

        return ret;
    }

    private async Task<List<StaticDecorCategory>> LoadDecor()
    {
        var decorCategories = await DataUtilities.LoadDumpCsvAsync<DumpDecorCategory>("decorcategory");
        var decorSubcategories = await DataUtilities.LoadDumpCsvAsync<DumpDecorSubcategory>("decorsubcategory");
        var decorIdToSubcategoryId = (await DataUtilities.LoadDumpCsvAsync<DumpDecorXDecorSubcategory>("decorxdecorsubcategory"))
            .ToGroupedDictionary(x => x.HouseDecorID, x => x.DecorSubcategoryID);
        var houseDecors = await DataUtilities.LoadDumpCsvAsync<DumpHouseDecor>("housedecor");

        var ret = new List<StaticDecorCategory>();
        var outCategoryMap = new Dictionary<short, StaticDecorCategory>();
        var outSubcategoryMap = new Dictionary<short, StaticDecorSubcategory>();

        foreach (var decorCategory in decorCategories.OrderBy(decorCategory => decorCategory.OrderIndex))
        {
            var outCategory = new StaticDecorCategory
            {
                Id = decorCategory.ID,
            };
            outCategoryMap.Add(outCategory.Id, outCategory);
            ret.Add(outCategory);
        }

        var subCategories = decorSubcategories
            .OrderBy(decorSubcategory => decorSubcategory.DecorCategoryID)
            .ThenBy(decorSubcategory => decorSubcategory.OrderIndex);
        foreach (var decorSubcategory in subCategories)
        {
            if (!outCategoryMap.TryGetValue(decorSubcategory.DecorCategoryID, out var outCategory))
            {
                ToolContext.Logger.Warning("Decor sub-category {s} has no category {c}!",  decorSubcategory.ID, decorSubcategory.DecorCategoryID);
                continue;
            }

            var outSubcategory = new StaticDecorSubcategory
            {
                Id = decorSubcategory.ID,
            };
            outSubcategoryMap.Add(outSubcategory.Id, outSubcategory);
            outCategory.Subcategories.Add(outSubcategory);
        }

        foreach (var houseDecor in houseDecors.OrderBy(houseDecor => houseDecor.OrderIndex))
        {
            if (!decorIdToSubcategoryId.TryGetValue(houseDecor.ID, out var outSubcategoryIds))
            {
                ToolContext.Logger.Warning("Decor {d} has no sub-category ids!", houseDecor.ID);
                continue;
            }

            foreach (var outSubcategoryId in outSubcategoryIds)
            {
                if (!outSubcategoryMap.TryGetValue(outSubcategoryId, out var outSubcategory))
                {
                    ToolContext.Logger.Warning("Decor {d} has no sub-category!", houseDecor.ID);
                    continue;
                }

                outSubcategory.Decors.Add(new StaticDecorObject
                {
                    Id = houseDecor.ID,
                    Type = houseDecor.Type,
                    ItemId = houseDecor.ItemID,
                });
            }
        }

        return ret;
    }

    private async Task<Dictionary<Language, List<OutProfession>>> LoadProfessions(
        Dictionary<int, List<OutTraitTree>> outSkillLineTraitsMap)
    {
        var itemNameToId = _stringMap
            .Where(kvp => kvp.Key is { Type: StringType.WowItemName, Language: Language.enUS })
            .GroupBy(kvp => kvp.Value)
            .ToDictionary(
                group => group.Key,
                group => group.MaxBy(kvp => kvp.Key.Id).Key.Id
            );

        var spellEffectMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellEffect>("spelleffect"))
            .ToGroupedDictionary(se => se.SpellID);

        var spellMiscMap = (await DataUtilities.LoadDumpCsvAsync<DumpSpellMisc>("spellmisc"))
            .Where(sm => sm.Flags8.HasFlag(WowSpellFlags8.AllianceOnly) || sm.Flags8.HasFlag(WowSpellFlags8.HordeOnly))
            .ToDictionary(sm => sm.SpellID);

        var craftingDataMap = (await DataUtilities.LoadDumpCsvAsync<DumpCraftingData>("craftingdata"))
            .ToDictionary(cd => cd.ID, cd => cd);

        var craftingEnchantMap =
            (await DataUtilities.LoadDumpCsvAsync<DumpCraftingDataEnchantQuality>("craftingdataenchantquality"))
            .GroupBy(cdeq => cdeq.CraftingDataID)
            .ToDictionary(
                group => group.Key,
                group => group.OrderByDescending(cdeq => cdeq.Rank).First()
            );

        var craftingItemsMap =
            (await DataUtilities.LoadDumpCsvAsync<DumpCraftingDataItemQuality>("craftingdataitemquality"))
            .ToGroupedDictionary(cdiq => cdiq.CraftingDataID);

        var skillLines = await DataUtilities.LoadDumpCsvAsync<DumpSkillLine>("skillline");

        var skillLineAbilities = await DataUtilities.LoadDumpCsvAsync<DumpSkillLineAbility>(
            "skilllineability",
            Language.enUS,
            ability => !Hardcoded.IgnoredSkillLineAbilities.Contains(ability.ID)
        );

        var professions = skillLines
            .Where(line => Hardcoded.PrimaryProfessions.Contains(line.ID) ||
                           Hardcoded.SecondaryProfessions.Contains(line.ID))
            .ToArray();

        var subProfessions = skillLines
            .Where(line => (Hardcoded.PrimaryProfessions.Contains(line.ParentSkillLineID) ||
                            Hardcoded.SecondaryProfessions.Contains(line.ParentSkillLineID)) &&
                           !Hardcoded.IgnoredProfessions.Contains(line.ID))
            .ToGroupedDictionary(line => line.ParentSkillLineID);

        var supersededBy = skillLineAbilities
            .Where(sla => sla.SupercedesSpell > 0)
            .GroupBy(sla => sla.SupercedesSpell)
            .ToDictionary(
                group => group.Key,
                group => group.First()
            );

        var spellSourceMap = (await DataUtilities.LoadDumpCsvAsync<DumpSourceInfo>("sourceinfo"))
            .GroupBy(dsi => dsi.SpellID)
            .ToDictionary(
                group => group.Key,
                group => group.OrderByDescending(dsi => dsi.ID)
                    .First()
                    .SourceTypeEnum
            );

        var skillLineParentMap = skillLines
            .Where(line => line.ParentSkillLineID > 0)
            .ToDictionary(line => line.ID, line => line.ParentSkillLineID);

        var categoryAbilities = skillLineAbilities
            .GroupBy(sla => sla.TradeSkillCategoryID)
            .ToDictionary(
                group => group.Key,
                group => group.ToArray()
            );

        var allProfs = new HashSet<int>(
            Hardcoded.PrimaryProfessions
                .Concat(Hardcoded.SecondaryProfessions)
        );

        // Shadowlands legendary base hacks, set up the superseded IDs for ranking
        foreach (int categoryId in new[]
                 {
                     1314, // Blacksmithing
                     1484, // Jewelcrafting
                     1472, // Leatherworking
                     1513, // Tailoring
                 })
        {
            var lastSlot = new Dictionary<string, int>();
            foreach (var ability in categoryAbilities[categoryId])
            {
                string spellName = GetString(StringType.WowSpellName, Language.enUS, ability.Spell);
                if (lastSlot.TryGetValue(spellName, out int lastSpellId))
                {
                    ability.SupercedesSpell = lastSpellId;
                    supersededBy[lastSpellId] = ability;
                }
                lastSlot[spellName] = ability.Spell;
            }
        }

        var ret = new Dictionary<Language, List<OutProfession>>();
        foreach (var language in Enum.GetValues<Language>())
        {
            var categories = await DataUtilities.LoadDumpCsvAsync<DumpTradeSkillCategory>(
                "tradeskillcategory",
                language,
                category => !Hardcoded.IgnoredTradeSkillCategories.Contains(category.ID)
            );

            var categoriesByProfession = new Dictionary<int, List<DumpTradeSkillCategory>>();
            foreach (var category in categories)
            {
                int professionId;
                if (allProfs.Contains(category.SkillLineID))
                {
                    professionId = category.SkillLineID;
                }
                else
                {
                    int parentId = skillLineParentMap.GetValueOrDefault(category.SkillLineID, 0);
                    // Continue up the tree until we run out or find a profession (Pandaria Cooking Ways suck)
                    while (parentId > 0 && !allProfs.Contains(parentId))
                    {
                        parentId = skillLineParentMap.GetValueOrDefault(parentId, 0);
                    }

                    professionId = parentId;
                }

                // if (professionId > 0)
                // {
                //     ToolContext.Logger.Information("Adding category {category} with profession {profession}", category.ID, professionId);
                // }

                if (!categoriesByProfession.ContainsKey(professionId))
                {
                    categoriesByProfession[professionId] = [];
                }
                categoriesByProfession[professionId].Add(category);
            }

            var professionRootCategories = new Dictionary<int, List<OutProfessionCategory>>();
            foreach (int professionId in allProfs)
            {
                if (!categoriesByProfession.TryGetValue(professionId, out var professionCategories))
                {
                    ToolContext.Logger.Warning("No profession categories for profession {id}", professionId);
                    continue;
                }

                var categoryMap = new Dictionary<int, OutProfessionCategory>();
                foreach (var category in professionCategories)
                {
                    // Why is this the only wonky one
                    if (category.ID == 1293)
                    {
                        category.OrderIndex = 920;
                    }

                    var outCategory = categoryMap[category.ID] = new OutProfessionCategory(category);

                    if (Hardcoded.ProfessionCategorySplits.TryGetValue(category.ID, out var splitCategories))
                    {
                        for (int splitIndex = 0; splitIndex < splitCategories.Length; splitIndex++)
                        {
                            var splitCategory = splitCategories[splitIndex];
                            int splitId = (category.ID * 1000) + splitIndex;
                            categoryMap[splitId] = new OutProfessionCategory(category)
                            {
                                Id = splitId,
                                Name = $"{category.AllianceName} > {splitCategory.Name}",
                            };
                        }
                    }

                    var abilities = categoryAbilities
                        .GetValueOrDefault(category.ID, [])
                        .Where(ability => ability.SupercedesSpell == 0 &&
                                          !Hardcoded.IgnoredSkillLineAbilitySpells.Contains(ability.Spell))
                        .OrderByDescending(ability => ability.MinSkillLineRank)
                        //.ThenByDescending(ability => ability.TrivialSkillLineRankLow)
                        .ThenByDescending(ability => ability.TrivialSkillLineRankHigh)
                        .ThenBy(ability => GetString(StringType.WowSpellName, language, ability.Spell))
                        .ToArray();
                    foreach (var ability in abilities)
                    {
                        var outAbility = new OutProfessionAbility(
                            ability,
                            GetString(StringType.WowSpellName, language, ability.Spell).Replace("WowSpellName", "Spell")
                        );

                        if (supersededBy.TryGetValue(ability.Spell, out var superAbility))
                        {
                            outAbility.Ranks = new();
                            while (superAbility != null)
                            {
                                outAbility.Ranks.Add(superAbility.ID);
                                outAbility.Ranks.Add(superAbility.Spell);
                                supersededBy.TryGetValue(superAbility.Spell, out superAbility);
                            }
                        }

                        if (spellEffectMap.TryGetValue(ability.Spell, out var abilityEffects))
                        {
                            foreach (var abilityEffect in abilityEffects)
                            {
                                craftingDataMap.TryGetValue(abilityEffect.EffectMiscValue0, out var craftingData);

                                // CraftingData
                                if (abilityEffect.Effect == 288 &&
                                    craftingData != null)
                                {
                                    outAbility.FirstCraftQuestId = craftingData.FirstCraftFlagQuestID;

                                    if (craftingData.CraftedItemID > 0)
                                    {
                                        outAbility.ItemId = craftingData.CraftedItemID;
                                    }
                                    // CraftingDataItemQuality, find the highest rank crafted item
                                    else if (craftingItemsMap.TryGetValue(abilityEffect.EffectMiscValue0,
                                            out var craftingItems))
                                    {
                                        var craftedItems =
                                            craftingItems.Select(ci => _itemMap.GetValueOrDefault(ci.ItemID))
                                                .Where(ci => ci != null)
                                                .OrderByDescending(ci => ci.CraftingQuality)
                                                .ToArray();
                                        if (craftedItems.Length > 0)
                                        {
                                            outAbility.ItemId = craftedItems[0].Id;
                                        }
                                    }
                                }
                                // CraftingDataEnchantQuality, find the highest rank crafted item
                                else if (abilityEffect.Effect == 301 &&
                                         craftingData != null &&
                                         craftingEnchantMap.TryGetValue(abilityEffect.EffectMiscValue0,
                                             out var enchantData))
                                {
                                    outAbility.FirstCraftQuestId = craftingData.FirstCraftFlagQuestID;
                                    outAbility.ItemId = enchantData.ItemID;
                                }
                                // 24=create item, 157=create loot
                                else if (abilityEffect.Effect is 24 or 157 && abilityEffect.EffectItemType > 0)
                                {
                                    outAbility.ItemId = abilityEffect.EffectItemType;
                                }
                            }
                        }

                        if (outAbility.ItemId == 0 && itemNameToId.TryGetValue(outAbility.Name, out int nameItemId))
                        {
                            outAbility.ItemId = nameItemId;
                        }

                        if (outAbility.ItemId > 0)
                        {
                            if (!_itemMap.TryGetValue(outAbility.ItemId, out var item))
                            {
                                ToolContext.Logger.Warning("Invalid item: {id}", outAbility.ItemId);
                                continue;
                            }

                            outAbility.ItemId2 = item.OppositeFactionId;

                            // If the spell name matches the item name we don't need to send it
                            if (outAbility.Name == GetString(StringType.WowItemName, language, outAbility.ItemId))
                            {
                                outAbility.Name = "";
                            }
                        }

                        if (spellMiscMap.TryGetValue(outAbility.SpellId, out var spellMisc))
                        {
                            if (spellMisc.Flags8.HasFlag(WowSpellFlags8.AllianceOnly))
                            {
                                outAbility.Faction = (short)WowFaction.Alliance;
                            }
                            else
                            {
                                outAbility.Faction = (short)WowFaction.Horde;
                            }
                        }

                        if (spellSourceMap.TryGetValue(outAbility.SpellId, out var spellSource))
                        {
                            outAbility.Source = spellSource;
                        }

                        bool added = false;
                        if (splitCategories != null)
                        {
                            string englishName = GetString(StringType.WowSpellName, Language.enUS, outAbility.SpellId);

                            for (int splitIndex = 0; splitIndex < splitCategories.Length; splitIndex++)
                            {
                                var splitCategory = splitCategories[splitIndex];
                                if (splitCategory.Matches(englishName, outAbility.SpellId))
                                {
                                    categoryMap[(outCategory.Id * 1000) + splitIndex].Abilities.Add(outAbility);
                                    added = true;
                                    break;
                                }
                            }
                        }

                        if (_reagents.Spells.TryGetValue(outAbility.SpellId, out var reagentsSpell))
                        {
                            outAbility.Reagents = reagentsSpell;
                        }

                        if (!added)
                        {
                            outCategory.Abilities.Add(outAbility);
                        }
                    }
                }

                var roots = new List<OutProfessionCategory>();
                foreach (var category in professionCategories)
                {
                    // Skip the weird Khaz Algar Herbalism categories
                    if (category.ID is 1909 or 1910)
                    {
                        continue;
                    }

                    if (category.ParentTradeSkillCategoryID > 0)
                    {
                        // Fix the weird Khaz Algar Herbalism category references
                        if (category.ParentTradeSkillCategoryID is 1909 or 1910)
                        {
                            category.ParentTradeSkillCategoryID += 90;
                        }

                        if (!categoryMap.TryGetValue(category.ParentTradeSkillCategoryID, out var parent))
                        {
                            ToolContext.Logger.Warning("No category? category={category} parent={parent}", category.ID, category.ParentTradeSkillCategoryID);
                            continue;
                        }

                        parent.Children.Add(categoryMap[category.ID]);

                        int extraCategoryId = category.ID * 1000;
                        while (categoryMap.ContainsKey(extraCategoryId))
                        {
                            parent.Children.Add(categoryMap[extraCategoryId]);
                            extraCategoryId++;
                        }
                    }
                    else
                    {
                        roots.Add(categoryMap[category.ID]);
                    }
                }

                professionRootCategories[professionId] = roots
                    .OrderByDescending(opc => opc.Order)
                    .ToList();

                foreach (var opc in categoryMap.Values)
                {
                    opc.Children = opc.Children
                        .OrderBy(child => child.Order)
                        .ToList();
                }
            }

            ret[language] = professions
                .Select(
                    profession => new OutProfession
                    {
                        Id = profession.ID,
                        Name = GetString(StringType.WowSkillLineName, language, profession.ID),
                        Slug = GetString(StringType.WowSkillLineName, Language.enUS, profession.ID)
                            .Split('|')[0]
                            .Slugify(),
                        Type = Hardcoded.PrimaryProfessions.Contains(profession.ID) ? 0 : 1,
                        SubProfessions = subProfessions
                            .GetValueOrDefault(profession.ID)
                            .EmptyIfNull()
                            .OrderBy(line => line.ParentTierIndex)
                            .Select(line => new OutSubProfession
                            {
                                Id = line.ID,
                                Name = GetString(StringType.WowSkillLineName, language, line.ID),
                                TraitTrees = outSkillLineTraitsMap.GetValueOrDefault(line.ID),
                            })
                            .ToList(),
                        Categories = professionRootCategories.GetValueOrDefault(profession.ID),
                    }
                ).ToList();
        }

#if DEBUG
        DumpFirstCraftQuestIDs(craftingDataMap);
#endif

        return ret;
    }

    private async Task<StaticProfessionReagents> LoadProfessionReagents()
    {
        var ret = new StaticProfessionReagents();

        var craftingQuality = await DataUtilities.LoadDumpToDictionaryAsync<DumpCraftingQuality, short, short>(
            "craftingquality",
            cq => cq.ID,
            cq => cq.QualityTier
        );
        var mcrSlotToCategories = await DataUtilities.LoadDumpCsvAsync<DumpMCRSlotXMCRCategory>("mcrslotxmcrcategory");
        var mcItems = await DataUtilities.LoadDumpCsvAsync<DumpModifiedCraftingItem>("modifiedcraftingitem");
        var mcReagentItems = await DataUtilities.LoadDumpCsvAsync<DumpModifiedCraftingReagentItem>("modifiedcraftingreagentitem");
        var mcReagentSlots = await DataUtilities.LoadDumpCsvAsync<DumpModifiedCraftingReagentSlot>("modifiedcraftingreagentslot");
        var mcSpellSlots = await DataUtilities.LoadDumpCsvAsync<DumpModifiedCraftingSpellSlot>("modifiedcraftingspellslot");
        var spellReagents = await DataUtilities.LoadDumpToDictionaryAsync<int, DumpSpellReagents>(
            "spellreagents",
            dsr => dsr.SpellID
        );

        var reagentItemToItemIds = mcItems
            .GroupBy(item => item.ModifiedCraftingReagentItemID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(item => craftingQuality.GetValueOrDefault<short, short>(item.CraftingQualityID, (short)0))
                    .Select(item => item.ItemID)
                    .ToArray()
            );

        var reagentSlotToCategoryIds = mcrSlotToCategories
            .GroupBy(mcr => mcr.ModifiedCraftingReagentSlotID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(mcr => mcr.Order)
                    .Select(mcr => mcr.ModifiedCraftingCategoryID)
                    .ToArray()
            );
        var reagentSlotToType = mcReagentSlots
            .ToDictionary(reagentSlot => reagentSlot.ID, reagentSlot => reagentSlot.ReagentType);
        var spellToSpellSlots = mcSpellSlots
            .GroupBy(spellSlot => spellSlot.SpellID)
            .ToDictionary(
                group => group.Key,
                group => group.OrderBy(spellSlot => spellSlot.Slot).ToArray()
            );

        ret.Categories = mcReagentItems
            .Where(ri => reagentItemToItemIds.ContainsKey(ri.ID))
            .GroupBy(ri => ri.ModifiedCraftingCategoryID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .SelectMany(ri => reagentItemToItemIds[ri.ID])
                    .ToArray()
            );

        foreach ((int spellId, var spellSlots) in spellToSpellSlots)
        {
            var spell = new StaticProfessionReagentsSpell();

            foreach (var spellSlot in spellSlots)
            {
                if (reagentSlotToType[spellSlot.ModifiedCraftingReagentSlotID] != WowReagentType.Basic)
                {
                    continue;
                }

                if (reagentSlotToCategoryIds.TryGetValue(spellSlot.ModifiedCraftingReagentSlotID,
                        out short[]? categoryIds))
                {
                    spell.CategoryReagents.Add(new StaticProfessionReagentsSpellReagent
                    {
                        Count = spellSlot.ReagentCount,
                        CategoryIds = categoryIds,
                    });
                }
            }

            if (spellReagents.TryGetValue(spellId, out var reagents))
            {
                foreach ((int count, int itemId) in reagents.Reagents)
                {
                    if (count > 0)
                    {
                        spell.ItemReagents.Add((count, itemId));
                    }
                }
            }

            if (spell.CategoryReagents.Count > 0 || spell.ItemReagents.Count > 0)
            {
                ret.Spells.Add(spellId, spell);
            }
        }

        return ret;
    }

    private void DumpFirstCraftQuestIDs(Dictionary<int, DumpCraftingData> craftingDataMap)
    {
        using var outFile = File.CreateText(Path.Join(DataUtilities.DataPath, "auto_crafting_data.txt"));

        var questIds = craftingDataMap
            .Values
            .Select(cd => cd.FirstCraftFlagQuestID)
            .Where(id => id > 0)
            .OrderBy(id => id);

        outFile.WriteLine("-- This data is overwritten by the *static* tool, don't edit by hand");
        outFile.WriteLine("Module.db.auto.crafting = {");

        foreach (int[] chunk in questIds.Chunk(12))
        {
            outFile.WriteLine("{0},", string.Join(",", chunk));
        }

        outFile.WriteLine("}");
    }

    private async Task<StaticQuestInfo[]> LoadQuestInfo(Language language)
    {
        var questInfos = await DataUtilities.LoadDumpCsvAsync<DumpQuestInfo>("questinfo", language);
        return questInfos.Select(qi => new StaticQuestInfo(qi)).ToArray();
    }

    private async Task<Dictionary<Language, Dictionary<int, List<OutSoulbind>>>> LoadSoulbinds()
    {
        // Load
        var soulbinds = await DataUtilities.LoadDumpCsvAsync<DumpSoulbind>("soulbind");

        var soulbindOrder = (await DataUtilities.LoadDumpCsvAsync<DumpSoulbindUiDisplayInfo>("soulbinduidisplayinfo"))
            .OrderBy(di => di.OrderIndex)
            .Select(di => di.SoulbindID)
            .ToArray();

        var talentTreeIds = new HashSet<int>(soulbinds.Select(soulbind => soulbind.GarrTalentTreeID));
        var talents = await DataUtilities.LoadDumpCsvAsync<DumpGarrTalent>(
            "garrtalent",
            validFunc: (talent) => talentTreeIds.Contains(talent.GarrTalentTreeID)
        );

        var talentIds = new HashSet<int>(talents.Select(talent => talent.ID));
        var talentSpellId = (await DataUtilities.LoadDumpCsvAsync<DumpGarrTalentRank>(
            "garrtalentrank",
            validFunc: rank => talentIds.Contains(rank.GarrTalentID)
        )).ToDictionary(
            rank => rank.GarrTalentID,
            rank => rank.PerkSpellID
        );

        // Mangle
        var soulbindsByCovenant = soulbinds
            .GroupBy(soulbind => soulbind.CovenantID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(soulbind => Array.IndexOf(soulbindOrder, soulbind.ID))
                    .ToList()
            );
        var talentsByTreeId = talents.ToGroupedDictionary(talent => talent.GarrTalentTreeID);

        // Process
        var ret = new Dictionary<Language, Dictionary<int, List<OutSoulbind>>>();

        foreach (var language in Enum.GetValues<Language>())
        {
            ret[language] = new Dictionary<int, List<OutSoulbind>>();

            foreach (var (covenantId, covenantSoulbinds) in soulbindsByCovenant)
            {
                var retCovenant = ret[language][covenantId] = new List<OutSoulbind>();

                foreach (var soulbind in covenantSoulbinds)
                {
                    retCovenant.Add(new OutSoulbind
                    {
                        Id = soulbind.ID,
                        Name = GetString(StringType.WowSoulbindName, language, soulbind.ID),
                        Renown = Hardcoded.SoulbindRenown[soulbind.ID],
                        Rows = talentsByTreeId[soulbind.GarrTalentTreeID]
                            .GroupBy(talent => talent.Tier)
                            .OrderBy(group => group.Key)
                            .Select(group => group
                                .OrderBy(talent => talent.UiOrder)
                                .Select(talent => new List<int>
                                {
                                    talent.UiOrder,
                                    talent.GarrTalentSocketPropertiesID > 0
                                        ? talent.GarrTalentSocketPropertiesID
                                        : talentSpellId[talent.ID],
                                })
                                .ToList()
                            )
                            .ToList()
                    });
                }
            }
        }

        return ret;
    }

    private static async Task<Dictionary<int, List<List<int>>>> LoadTalents()
    {
        var talents = await DataUtilities.LoadDumpCsvAsync<DumpTalent>("talent");

        // classId => { tierId => { column => talent } }
        var classTalents = talents
            .Where(talent => talent.ClassID > 0 && talent.SpecID == 0)
            .GroupBy(talent => talent.ClassID)
            .ToDictionary(
                classGroup => classGroup.Key,
                classGroup => classGroup
                    .GroupBy(talent => talent.TierID)
                    .ToDictionary(
                        tierGroup => tierGroup.Key,
                        tierGroup => tierGroup
                            .ToDictionary(talent => talent.ColumnIndex)
                    )
            );

        // specId => { tierId => { column => talent } }
        var specTalents = talents
            .Where(talent => talent.ClassID > 0 && talent.SpecID > 0)
            .GroupBy(talent => talent.SpecID)
            .ToDictionary(
                specGroup => specGroup.Key,
                specGroup => specGroup
                    .GroupBy(talent => talent.TierID)
                    .ToDictionary(
                        tierGroup => tierGroup.Key,
                        tierGroup => tierGroup
                            .ToDictionary(talent => talent.ColumnIndex)
                    )
            );

        // specId => classId
        var specToClass = talents
            .Where(talent => talent.ClassID > 0)
            .GroupBy(talent => talent.SpecID)
            .ToDictionary(
                specGroup => specGroup.Key,
                specGroup => specGroup.First().ClassID
            );

        var ret = new Dictionary<int, List<List<int>>>();
        foreach (var (specId, tiers) in specTalents)
        {
            var specData = new List<List<int>>();

            for (int tierIndex = 0; tierIndex <= 6; tierIndex++)
            {
                var tierData = new List<int>();
                tiers.TryGetValue(tierIndex, out var columns);

                for (int columnIndex = 0; columnIndex <= 2; columnIndex++)
                {
                    DumpTalent talent = null;
                    if (columns != null)
                    {
                        columns.TryGetValue(columnIndex, out talent);
                    }

                    if (talent == null)
                    {
                        classTalents[specToClass[specId]][tierIndex].TryGetValue(columnIndex, out talent);
                    }

                    tierData.Add(talent?.SpellID ?? 0);
                }

                specData.Add(tierData);
            }

            ret[specId] = specData;
        }

        return ret;
    }

    private static async Task<List<T>> LoadCsv<T>(
        string fileName,
        Language language = Language.enUS,
        Func<T, bool>? validFunc = null
    ) => await DataUtilities.LoadDumpCsvAsync<T>(fileName, language, validFunc);

    private static async Task<Dictionary<int, List<OutTraitTree>>> LoadTraits()
    {
        // Simple mappings
        var traitCondById = (await LoadCsv<DumpTraitCond>("traitcond"))
            .ToDictionary(tc => tc.ID);

        var traitDefinitionById = (await LoadCsv<DumpTraitDefinition>("traitdefinition"))
            .ToDictionary(td => td.ID);

        var traitNodeById = (await LoadCsv<DumpTraitNode>("traitnode"))
            .ToDictionary(tn => tn.ID);

        var traitNodeIdToTraitEdges = (await LoadCsv<DumpTraitEdge>("traitedge"))
            .ToGroupedDictionary(group => group.LeftTraitNodeID);

        var traitNodeEntryById = (await LoadCsv<DumpTraitNodeEntry>("traitnodeentry"))
            .ToDictionary(tne => tne.ID);

        var traitNodeGroupById = (await LoadCsv<DumpTraitNodeGroup>("traitnodegroup"))
            .ToDictionary(tng => tng.ID);

        var traitTreeById = (await LoadCsv<DumpTraitTree>("traittree"))
            .ToDictionary(tt => tt.ID);

        var traitNodeGroupXTraitNodes = await LoadCsv<DumpTraitNodeGroupXTraitNode>("traitnodegroupxtraitnode");

        // Annoying mappings
        var skillLineIdToTraitTrees = (await LoadCsv<DumpSkillLineXTraitTree>("skilllinextraittree"))
            .GroupBy(slxtt => slxtt.SkillLineID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(slxtt => slxtt.Variant)
                    .Select(slxtt => traitTreeById[slxtt.TraitTreeID])
                    .ToArray()
            );

        var traitNodeIdToTraitNodeEntries = (await LoadCsv<DumpTraitNodeXTraitNodeEntry>("traitnodextraitnodeentry"))
            .GroupBy(tnxtne => tnxtne.TraitNodeID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Where(tnxtne => tnxtne.TraitNodeEntryID > 0)
                    .OrderBy(tnxtne => tnxtne.Index)
                    .Select(tnxtne => traitNodeEntryById[tnxtne.TraitNodeEntryID])
                    .ToArray()
            );

        var traitNodeIdToTraitNodeGroups = traitNodeGroupXTraitNodes
            .Where(tngxtn => tngxtn.TraitNodeGroupID > 0)
            .GroupBy(tngxtn => tngxtn.TraitNodeID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .Select(tngxtn => traitNodeGroupById[tngxtn.TraitNodeGroupID])
                    .ToArray()
            );

        var traitNodeGroupIdToTraitNodes = traitNodeGroupXTraitNodes
            .Where(tngxtn => tngxtn.TraitNodeGroupID > 0)
            .GroupBy(tngxtn => tngxtn.TraitNodeGroupID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(tngxtn => tngxtn.Index)
                    .Select(tngxtn => traitNodeById[tngxtn.TraitNodeID])
                    .ToArray()
            );

        // TraitNodeXTraitCond
        var traitCondIdToTraitNode = (await LoadCsv<DumpTraitNodeXTraitCond>("traitnodextraitcond"))
            .GroupBy(tnxtc => tnxtc.TraitCondID)
            .ToDictionary(
                group => group.Key,
                group => traitNodeById[group.First().TraitNodeID]
            );
            // .GroupBy(tnxtc => tnxtc.TraitCondID)
            // .ToDictionary(
            //     group => group.Key,
            //     group => group
            //         .Select(tnxtc => traitNodeById[tnxtc.TraitNodeID])
            //         .ToArray()
            // );

        // Reverse lookup from TraitCond.TraitNodeID
        var traitNodeIdToRelatedTraitConds = traitCondById
            .Values
            .Where(tc => tc.TraitNodeID > 0)
            .GroupBy(tc => tc.TraitNodeID)
            .ToDictionary(
                group => group.Key,
                group => group
                    .OrderBy(tc => tc.SpentAmountRequired)
                    .ToArray()
            );

        var traitTreeIdToTraitNodeGroups = traitNodeGroupById.Values
            .ToGroupedDictionary(tng => tng.TraitTreeID);

        // Work it
        var ret = new Dictionary<int, List<OutTraitTree>>();

        foreach ((int skillLineId, var dumpTrees) in skillLineIdToTraitTrees.OrderBy(kvp => kvp.Key))
        {
            ToolContext.Logger.Information("SkillLine {id}", skillLineId);

            var outTrees = ret[skillLineId] = new();
            foreach (var dumpTree in dumpTrees)
            {
                ToolContext.Logger.Information("  Tree {tree}", dumpTree.ID);

                if (dumpTree.FirstTraitNodeID == 0)
                {
                    continue;
                }

                var outTree = new OutTraitTree(dumpTree.ID);
                outTrees.Add(outTree);

                var nodeIdQueue = new Queue<int>();
                var nodeMap = new Dictionary<int, OutTraitNode>();

                nodeIdQueue.Enqueue(dumpTree.FirstTraitNodeID);
                outTree.FirstNode = nodeMap[dumpTree.FirstTraitNodeID] = new OutTraitNode(dumpTree.FirstTraitNodeID);

                while (nodeIdQueue.Count > 0)
                {
                    int nodeId = nodeIdQueue.Dequeue();
                    ToolContext.Logger.Information("    Node: {id}", nodeId);

                    var traitNode = traitNodeById[nodeId];

                    var entries = traitNodeIdToTraitNodeEntries[nodeId];
                    if (entries.Length != 2)
                    {
                        ToolContext.Logger.Error("      {n} entrie(s)??", entries.Length);
                        continue;
                    }

                    var outNode = nodeMap[nodeId];

                    outNode.UnlockEntryId = entries[0].ID;
                    outNode.RankEntryId = entries[1].ID;
                    outNode.RankMax = entries[1].MaxRanks;

                    var def = traitDefinitionById[entries[0].TraitDefinitionID];
                    outNode.Name = def.OverrideName;

                    if (traitNodeIdToTraitEdges.TryGetValue(nodeId, out var edges))
                    {
                        foreach (var edge in edges)
                        {
                            nodeIdQueue.Enqueue(edge.RightTraitNodeID);
                            var edgeNode = nodeMap[edge.RightTraitNodeID] = new OutTraitNode(edge.RightTraitNodeID);
                            outNode.Children.Add(edgeNode);
                        }
                    }

                    var conds = traitNodeIdToRelatedTraitConds[nodeId];
                    foreach (var cond in conds)
                    {
                        if (traitCondIdToTraitNode.TryGetValue(cond.ID, out var condNode))
                        {
                            var condEntries = traitNodeIdToTraitNodeEntries[condNode.ID];
                            var condDef = traitDefinitionById[condEntries[0].TraitDefinitionID];

                            outNode.Perks.Add(new OutTraitPerk
                            {
                                Description = condDef.OverrideDescription,
                                NodeId = condNode.ID,
                                SpentPoints = cond.SpentAmountRequired,
                            });
                        }
                        else
                        {
                            ToolContext.Logger.Warning("        No TraitCond->TraitNode for {cond}", cond.ID);
                        }
                    }
                }
            }
        }

        return ret;
    }

    private async Task<Dictionary<int, List<int>>> LoadEnchantmentValues()
    {
        var spellItemEnchantments = await DataUtilities.LoadDumpCsvAsync<DumpSpellItemEnchantment>("spellitemenchantment");

        var spellScalings = await DataUtilities.LoadGameTableAsync<GameTableSpellScaling>("SpellScaling");
        var spellScalingByLevel = spellScalings.ToDictionary(scaling => scaling.Level);

        var ret = new Dictionary<int, List<int>>();

        foreach (var spellItemEnchantment in spellItemEnchantments)
        {
            // Only care about -7 for now which is uhh SpellScaling->Item
            if (spellItemEnchantment.ScalingClass != -7 ||
                spellItemEnchantment.MaxLevel == 0 ||
                spellItemEnchantment.EffectScalingPoints0 == 0)
            {
                continue;
            }

            var spellScaling = spellScalingByLevel[spellItemEnchantment.MaxLevel];
            var values = ret[spellItemEnchantment.ID] = [];

            foreach (double scaling in spellItemEnchantment.EffectScalingPoints)
            {
                if (scaling != 0)
                {
                    values.Add((int)Math.Round(scaling * spellScaling.Item));
                }
            }
        }

        return ret;
    }

    private async Task<List<StaticHeirloom>> LoadHeirlooms()
    {
        var heirlooms = await DataUtilities.LoadDumpCsvAsync<DumpHeirloom>("heirloom");

        var ret = new List<StaticHeirloom>();

        foreach (var heirloom in heirlooms)
        {
            ret.Add(new StaticHeirloom
            {
                Id = heirloom.ID,
                ItemId = heirloom.ItemID,
                UpgradeBonusIds = heirloom.UpgradeBonusIDs.ToList(),
                UpgradeItemIds = heirloom.UpgradeItemIDs.ToList(),
            });
        }

        return ret;
    }

    private async Task<Dictionary<int, StaticIllusion>> LoadIllusions()
    {
        return (await DataUtilities
            .LoadDumpCsvAsync<DumpTransmogIllusion>("transmogillusion"))
            .ToDictionary(
                illusion => illusion.ID,
                illusion => new StaticIllusion(illusion)
            );
    }

    private static readonly HashSet<int> InstanceTypes = new HashSet<int>() {
        1, // Party Dungeon
        2, // Raid Dungeon
    };

    private async Task<List<OutInstance>> LoadInstances()
    {
        var journalInstances = await DataUtilities
            .LoadDumpCsvAsync<DumpJournalInstance>("journalinstance");

        var mapsById = (await DataUtilities.LoadDumpCsvAsync<DumpMap>("map"))
            .ToDictionary(map => map.ID);

        var sigh = new Dictionary<int, OutInstance>();
        foreach (var journalInstance in journalInstances)
        {
            if (Hardcoded.SkipInstances.Contains(journalInstance.ID))
            {
                continue;
            }

            if (mapsById.TryGetValue(journalInstance.MapID, out var map))
            {
                if (InstanceTypes.Contains(map.InstanceType))
                {
                    sigh.Add(journalInstance.ID, new OutInstance(map, journalInstance.ID));
                }
                else
                {
                    ToolContext.Logger.Warning("Invalid instance type for instance {InstanceId}: {Type}", journalInstance.ID, map.InstanceType);
                }
            }
            else
            {
                ToolContext.Logger.Warning("No mapsById entry for {InstanceId}??", journalInstance.ID);
            }
        }

        /*foreach (var map in maps.Where(m => mapIdToInstanceId.ContainsKey(m.ID) && InstanceTypes.Contains(m.InstanceType)))
        {
            if (mapIdToInstanceId.TryGetValue(map.ID, out int instanceId))
            {
                if (sigh.ContainsKey(instanceId))
                {
                    ToolContext.Logger.Information("DUPLICATE BULLSHIT: mapId={MapId} instanceId={InstanceId}", map.ID, instanceId);
                }
                else
                {
                    sigh.Add(instanceId, new OutInstance(map, instanceId));
                }
            }
            else
            {
                ToolContext.Logger.Information("No mapIdToInstanceId for {MapId}??", map.ID);
            }
        }*/
        return sigh.Values
            .OrderBy(instance => instance.Expansion)
            .ThenBy(instance => instance.Id)
            .ToList();
    }
}
