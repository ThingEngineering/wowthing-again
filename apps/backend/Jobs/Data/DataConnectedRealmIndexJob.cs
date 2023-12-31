using System.Text.RegularExpressions;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data;

public class DataConnectedRealmIndexJob : JobBase
{
    private const string ApiPath = "data/wow/connected-realm/index";
    private static readonly Regex RealmIdRegex = new Regex(@"\/(\d+)\?", RegexOptions.Compiled);

    public override async Task Run(string[] data)
    {
        foreach (var region in EnumUtilities.GetValues<WowRegion>())
        {
            var uri = GenerateUri(region, ApiNamespace.Dynamic, ApiPath);
            var result = await GetJson<ApiDataConnectedRealmIndex>(uri, useLastModified: false);

            foreach (var href in result.Data.ConnectedRealms)
            {
                var match = RealmIdRegex.Match(href.Href);
                await JobRepository.AddJobAsync(JobPriority.Low, JobType.DataConnectedRealm, ((int)region).ToString(), match.Groups[1].Value);
            }
        }
    }
}
