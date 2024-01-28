using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterPetsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/pets";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        if (query?.AccountId == null)
        {
            throw new InvalidDataException("AccountId is null");
        }

        string lockKey = $"character_pets:{query.AccountId}";
        string lockValue = Guid.NewGuid().ToString("N");
        try
        {
            // Attempt to get exclusive scheduler lock
            bool lockSuccess = await JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1));
            if (!lockSuccess)
            {
                Logger.Debug("Skipping pets, lock failed");
                return;
            }
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
            return;
        }

        // Fetch API data
        ApiCharacterPets resultData;
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterPets>(uri, useLastModified: false);
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

        // Fetch character data
        var pets = await Context.PlayerAccountPets.FindAsync(query.AccountId.Value);
        if (pets == null)
        {
            pets = new PlayerAccountPets
            {
                AccountId = query.AccountId.Value,
            };
            Context.PlayerAccountPets.Add(pets);
        }

        pets.Pets = resultData.Pets
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

        pets.UpdatedAt = DateTime.UtcNow;

        await Context.SaveChangesAsync();

        await JobRepository.ReleaseLockAsync(lockKey, lockValue);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
