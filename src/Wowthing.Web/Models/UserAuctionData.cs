using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Web.Models
{
    public class UserAuctionData
    {
        public Dictionary<int, List<WowAuction>> Auctions { get; set; }
        public Dictionary<int, string> Names { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<int, UserAuctionDataPet[]> Pets { get; set; }
    }

    public class UserAuctionDataPet
    {
        public int BreedId { get; set; }
        public int Level { get; set; }
        public ItemLocation Location { get; set; }
        public WowQuality Quality { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? LocationId { get; set; }

        public UserAuctionDataPet(PlayerAccountPetsPet pet)
        {
            BreedId = pet.BreedId;
            Level = pet.Level;
            Quality = pet.Quality;
            Location = ItemLocation.PetCollection;
        }

        public UserAuctionDataPet(PlayerCharacterItem cagedPet)
        {
            BreedId = 0;
            Level = cagedPet.ItemLevel;
            Quality = (WowQuality)cagedPet.Quality;
            Location = cagedPet.Location;
            LocationId = cagedPet.CharacterId;
        }

        public UserAuctionDataPet(PlayerGuildItem cagedPet)
        {
            BreedId = 0;
            Level = cagedPet.ItemLevel;
            Quality = (WowQuality)cagedPet.Quality;
            Location = ItemLocation.GuildBank;
            LocationId = cagedPet.TabId;
        }
    }
}
