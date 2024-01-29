using System.Net.Http;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data;

public class DataQuestJob : JobBase
{
    private const string ApiPath = "data/wow/quest/{0}";

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

    public override async Task Run(string[] data)
    {
        var questId = int.Parse(data[0]);
        using var shrug = QuestLog(questId);

        var languageMap = await Context.LanguageString
            .Where(ls => ls.Type == StringType.WowQuestName && ls.Id == questId)
            .ToDictionaryAsync(ls => ls.Language);

        // Fetch API data
        foreach (var (language, locale) in LanguageToLocale)
        {
            var uri = GenerateUri(
                WowRegion.US,
                ApiNamespace.Static,
                string.Format(ApiPath, questId),
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
                continue;
            }

            if (!languageMap.TryGetValue(language, out var languageString))
            {
                languageString = new LanguageString
                {
                    Language = language,
                    Type = StringType.WowQuestName,
                    Id = questId,
                };
                Context.Add(languageString);
            }

            if (languageString.String != resultData.Title)
            {
                languageString.String = resultData.Title;
            }
        }

        await Context.SaveChangesAsync();
    }
}
