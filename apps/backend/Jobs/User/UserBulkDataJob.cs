using System.Net.Http;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.User;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.User;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.User;

public class UserBulkDataJob : JobBase
{
    private const string HeirloomsApiPath = "profile/user/wow/collections/heirlooms?access_token={0}";
    private const string MountsApiPath = "profile/user/wow/collections/mounts?access_token={0}";
    private const string PetsApiPath = "profile/user/wow/collections/pets?access_token={0}";
    private const string ToysApiPath = "profile/user/wow/collections/toys?access_token={0}";
    private const string TransmogsApiPath = "profile/user/wow/collections/transmogs?access_token={0}";

    private long _userId;
    private string _accessToken = string.Empty;
    private JankTimer _timer;
    private UserBulkData _bulkData;

    public override void Setup(string[] data)
    {
        _userId = long.Parse(data[0]);
        UserLog(_userId);
    }

    public override async Task Run(string[] data)
    {
        _timer = new JankTimer();

        // Get user access token
        var accessToken = await Context.UserTokens.FirstOrDefaultAsync(t =>
            t.UserId == _userId && t.LoginProvider == "BattleNet" && t.Name == "access_token");
        if (accessToken == null)
        {
            Logger.Error("No access_token for user {0}", _userId);
            return;
        }

        _accessToken = accessToken.Value;

        _timer.AddPoint("Token");

        _bulkData = await Context.UserBulkData.FindAsync(_userId);
        if (_bulkData == null)
        {
            _bulkData = new UserBulkData { UserId = _userId };
            Context.UserBulkData.Add(_bulkData);
        }

        _timer.AddPoint("Load");

        await FetchHeirlooms();
        _timer.AddPoint("Heirlooms");

        await FetchMounts();
        _timer.AddPoint("Mounts");

        await FetchPets();
        _timer.AddPoint("Pets");

        await FetchToys();
        _timer.AddPoint("Toys");

        await FetchTransmogs();
        _timer.AddPoint("Transmogs");

        await Context.SaveChangesAsync(CancellationToken);

        _timer.AddPoint("Save", true);

        await CacheService.ResetForBulkData(Context, _timer, _userId);

        Logger.Information("{timer}", _timer.ToString());
    }

    private async Task FetchHeirlooms()
    {
        string path = string.Format(HeirloomsApiPath, _accessToken);

        // Fetch API data
        ApiUserHeirlooms resultData;
        var uri = GenerateUri(WowRegion.US, ApiNamespace.Profile, path);
        try {
            var result = await GetUriAsJsonAsync<ApiUserHeirlooms>(uri, timer: _timer, useAuthorization: false, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        _bulkData.Heirlooms = resultData.Heirlooms
            .EmptyIfNull()
            .ToDictionary(
                heirloom => heirloom.Heirloom.Id,
                heirloom => heirloom.Upgrade.Level
            );
        _bulkData.HeirloomsUpdatedAt = DateTime.UtcNow;
    }

    private async Task FetchMounts()
    {
        string path = string.Format(MountsApiPath, _accessToken);

        // Fetch API data
        ApiUserMounts resultData;
        var uri = GenerateUri(WowRegion.US, ApiNamespace.Profile, path);
        try {
            var result = await GetUriAsJsonAsync<ApiUserMounts>(uri, timer: _timer, useAuthorization: false, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        _bulkData.MountIds = resultData.Mounts
            .Select(mount => (short)mount.Mount.Id)
            .OrderBy(mountId => mountId)
            .ToList();
        _bulkData.MountsUpdatedAt = DateTime.UtcNow;
    }

    private async Task FetchPets()
    {
        string path = string.Format(PetsApiPath, _accessToken);

        // Fetch API data
        ApiUserPets resultData;
        var uri = GenerateUri(WowRegion.US, ApiNamespace.Profile, path);
        try {
            var result = await GetUriAsJsonAsync<ApiUserPets>(uri, timer: _timer, useAuthorization: false, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        _bulkData.Pets = resultData.Pets
            .EmptyIfNull()
            .ToDictionary(
                k => k.Id,
                v => new PlayerAccountPetsPet
                {
                    BreedId = v.Stats.BreedId,
                    Level = v.Level,
                    Quality = v.Quality.EnumParse<WowQuality>(),
                    SpeciesId = v.Species.Id,
                }
            );
        _bulkData.PetsUpdatedAt = DateTime.UtcNow;
    }

    private async Task FetchToys()
    {
        string path = string.Format(ToysApiPath, _accessToken);

        // Fetch API data
        ApiUserToys resultData;
        var uri = GenerateUri(WowRegion.US, ApiNamespace.Profile, path);
        try {
            var result = await GetUriAsJsonAsync<ApiUserToys>(uri, timer: _timer, useAuthorization: false, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        _bulkData.ToyIds = resultData.Toys
            .EmptyIfNull()
            .Select(toy => (short)toy.Toy.Id)
            .ToList();
        _bulkData.ToysUpdatedAt = DateTime.UtcNow;
    }

    private async Task FetchTransmogs()
    {
        string path = string.Format(TransmogsApiPath, _accessToken);

        // Fetch API data
        ApiUserTransmogs resultData;
        var uri = GenerateUri(WowRegion.US, ApiNamespace.Profile, path);
        try {
            var result = await GetUriAsJsonAsync<ApiUserTransmogs>(uri, timer: _timer, useAuthorization: false, useLastModified: false);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        _bulkData.TransmogIds = resultData.Slots
            .SelectMany(slot => slot.Appearances.Select(app => app.Id))
            .Order()
            .Distinct()
            .ToList();
        _bulkData.TransmogsUpdatedAt = DateTime.UtcNow;
    }
}
