using Serilog.Context;
using Wowthing.Tool.Models.Auctions;

namespace Wowthing.Tool.Tools;

public class AuctionTool
{
    private readonly JankTimer _timer = new();

    public async Task Run(params string[] data)
    {
        using var foo = LogContext.PushProperty("Task", "Auction");

        ToolContext.Logger.Information("Loading data...");

        var db = ToolContext.Redis.GetDatabase();
        var cacheData = new RedisAuctionData();

        string cacheHash = null;
        foreach (var language in Enum.GetValues<Language>())
        {
            ToolContext.Logger.Information("Generating {lang}...", language);

            cacheData.RawCategories = await LoadAuctionCategories(language);

            string cacheJson = ToolContext.SerializeJson(cacheData);
            // This ends up being the MD5 of enUS, close enough
            cacheHash ??= cacheJson.Md5();

            await db.SetCacheDataAndHash($"auction-{language.ToString()}", cacheJson, cacheHash);

            _timer.AddPoint(language.ToString());
        }

        _timer.Stop();
        ToolContext.Logger.Information("{0}", _timer.ToString());
    }

    private async Task<List<OutAuctionCategory>> LoadAuctionCategories(Language language)
    {
        var categories = await DataUtilities.LoadDumpCsvAsync<DumpAuctionHouseCategory>(
            "auctionhousecategory", language);

        var catMap = new Dictionary<int, OutAuctionCategory>();
        foreach (var category in categories)
        {
            catMap[category.ID] = new OutAuctionCategory(category);
        }

        var ret = new List<OutAuctionCategory>();
        foreach (var category in categories)
        {
            var outCategory = catMap[category.ID];
            if (category.ParentCategory > 0)
            {
                catMap[category.ParentCategory].Children.Add(outCategory);
            }
            else
            {
                ret.Add(outCategory);
            }
        }

        ret.Sort();
        foreach (var category in catMap.Values)
        {
            category.Children.Sort();
        }

        return ret;
    }
}
