using System.Collections;
using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterPetsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/collections/pets";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        if (_query?.AccountId == null)
        {
            throw new InvalidDataException("AccountId is null");
        }

        string lockKey = $"character_pets:{_query.AccountId}";
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
        var uri = GenerateUri(_query, ApiPath);
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
        var pets = await Context.PlayerAccountPets.FindAsync(_query.AccountId.Value);
        if (pets == null)
        {
            pets = new PlayerAccountPets
            {
                AccountId = _query.AccountId.Value,
            };
            Context.PlayerAccountPets.Add(pets);
        }

        bool madeChanges = false;
        var existingIds = new HashSet<long>(pets.Pets.Keys);
        var seenIds = new HashSet<long>();

        foreach (var apiPet in resultData.Pets)
        {
            if (!pets.Pets.TryGetValue(apiPet.Id, out var dbPet))
            {
                dbPet = pets.Pets[apiPet.Id] = new PlayerAccountPetsPet();
                madeChanges = true;
            }

            var apiPetQuality = apiPet.Quality.EnumParse<WowQuality>();
            if (apiPet.Stats.BreedId != dbPet.BreedId ||
                apiPet.Level != dbPet.Level ||
                apiPetQuality != dbPet.Quality ||
                apiPet.Species.Id != dbPet.SpeciesId)
            {
                dbPet.BreedId = apiPet.Stats.BreedId;
                dbPet.Level = apiPet.Level;
                dbPet.Quality = apiPetQuality;
                dbPet.SpeciesId = apiPet.Species.Id;
                madeChanges = true;
            }
        }

        // Remove any that we didn't see and were NOT added via addon data
        foreach (long unseenId in existingIds.Except(seenIds))
        {
            if (!pets.Pets[unseenId].FromAddon)
            {
                pets.Pets.Remove(unseenId);
                madeChanges = true;
            }
        }

        if (madeChanges)
        {
            var entry = Context.Entry(pets);
            entry.Property(pap => pap.Pets).IsModified = true;

            pets.UpdatedAt = DateTime.UtcNow;

            await Context.SaveChangesAsync(CancellationToken);
        }

        await JobRepository.ReleaseLockAsync(lockKey, lockValue);
    }

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
