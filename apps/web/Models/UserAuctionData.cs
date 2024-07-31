using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models;

public class UserAuctionData
{
    public Dictionary<int, List<WowAuction>> RawAuctions { get; set; }
    public Dictionary<int, string> Names { get; set; }
    public Dictionary<int, long> Updated { get; set; }

    public Dictionary<short, UserAuctionDataPet[]> Pets { get; set; }
}

public class UserAuctionDataPet
{
    public int BreedId { get; set; }
    public int Level { get; set; }
    public ItemLocation Location { get; set; }
    public WowQuality Quality { get; set; }

    public int? LocationId { get; set; }

    public UserAuctionDataPet(PlayerAccountPetsPet pet)
    {
        BreedId = pet.BreedId;
        Level = pet.Level;
        Quality = pet.Quality;
        Location = ItemLocation.PetCollection;
    }

    public UserAuctionDataPet(PlayerCharacterItem item, bool caged = false)
    {
        BreedId = 0;
        Quality = (WowQuality)item.Quality;
        Location = item.Location;
        LocationId = item.CharacterId;

        Level = caged ? item.ItemLevel : 1;
    }

    public UserAuctionDataPet(PlayerGuildItem item, bool caged = false)
    {
        BreedId = 0;
        Location = ItemLocation.GuildBank;
        LocationId = item.TabId;
        Quality = (WowQuality)item.Quality;

        Level = caged ? item.ItemLevel : 1;
    }
}
