using System.Net.Http;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data;

public class DataQuestJob : JobBase
{
    private int _questId;
    private WowRegion _region;

    private const string ApiPath = "data/wow/quest/{0}";

    private static readonly Dictionary<WowRegion, Language[]> RegionLanguages = new()
    {
        { WowRegion.US, [Language.enUS] },
    };

    private static readonly Dictionary<Language, string> LanguageToLocale = new()
    {
        { Language.deDE, "de_DE" },
        { Language.enUS, "en_US" },
        { Language.esES, "es_ES" },
        { Language.esMX, "es_MX" },
        { Language.itIT, "it_IT" },
        { Language.frFR, "fr_FR" },
        { Language.koKR, "ko_KR" },
        { Language.ptBR, "pt_BR" },
        { Language.ruRU, "ru_RU" },
        { Language.zhCN, "zh_CN" },
        { Language.zhTW, "zh_TW" },
    };

    public override void Setup(string[] data)
    {
        _region = (WowRegion)int.Parse(data[0]);
        _questId = int.Parse(data[1]);
        QuestLog(_questId);
    }

    public override async Task Run(string[] data)
    {
        var dbQuest = await Context.WowQuest.FindAsync(_questId);
        if (dbQuest == null)
        {
            Logger.Error("WowQuest missing?? {id}", _questId);
            return;
        }

        var languages = RegionLanguages[_region];
        var languageMap = await Context.LanguageString
            .Where(ls => languages.Contains(ls.Language) &&
                        ls.Type == StringType.WowQuestName &&
                         ls.Id == _questId)
            .ToDictionaryAsync(ls => ls.Language);

        // Fetch API data
        foreach (var language in languages)
        {
            string locale = LanguageToLocale[language];

            if (!languageMap.TryGetValue(language, out var languageString))
            {
                languageString = new LanguageString
                {
                    Language = language,
                    Type = StringType.WowQuestName,
                    Id = _questId,
                };
                Context.Add(languageString);
            }

            var uri = GenerateUri(
                WowRegion.US,
                ApiNamespace.Static,
                string.Format(ApiPath, _questId),
                locale
            );

            ApiDataQuest resultData;
            try
            {
                var result = await GetUriAsJsonAsync<ApiDataQuest>(uri, timer: new JankTimer());
                if (result.NotModified)
                {
                    LogNotModified();
                    continue;
                }

                resultData = result.Data;
            }
            catch (HttpRequestException e)
            {
                Logger.Error("{locale} HTTP {error}", locale, e.Message);

                if (e.Message == "404")
                {
                    languageString.String = "~NOTFOUND~";
                    break;
                }

                continue;
            }

            if (languageString.String != resultData.Title)
            {
                languageString.String = resultData.Title;
            }

            dbQuest.AreaId = resultData.Area?.Id ?? 0;
            dbQuest.CategoryId = resultData.Category?.Id ?? 0;
            dbQuest.MinimumLevel = resultData.Requirements?.MinCharacterLevel ?? 0;
            dbQuest.MaximumLevel = resultData.Requirements?.MaxCharacterLevel ?? 0;
        }

        await Context.SaveChangesAsync(CancellationToken);
    }
}
