using System.Collections.Generic;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models
{
    public class UserCollectionData
    {
        public string MountsPacked { get; init; }
        public string ToysPacked { get; init; }

        public Dictionary<int, List<UserPetDataPet>> Pets { get; set; }
    }

    public class UserPetDataPet
    {
        public int BreedId { get; set; }
        public int Level { get; set; }
        public WowQuality Quality { get; set; }

        public UserPetDataPet(PlayerAccountPetsPet pet)
        {
            BreedId = pet.BreedId;
            Level = pet.Level;
            Quality = pet.Quality;
        }
    }
}
