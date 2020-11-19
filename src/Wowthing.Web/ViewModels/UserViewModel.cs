using System.Collections.Generic;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels
{
    public class UserViewModel
    {
        public readonly ApplicationUser User;
        public readonly List<UserCharacter> Characters;
        
        private readonly Dictionary<int, WowRace> _races;

        public UserViewModel(ApplicationUser user, List<UserCharacter> characters, Dictionary<int, WowRace> races)
        {
            User = user;
            Characters = characters;
            _races = races;
        }

        public string GetRaceIcon(WowGender gender, int raceId)
        {
            if (_races.TryGetValue(raceId, out WowRace race))
            {
                return race.GetGenderIcon(gender);
            }
            return "uhoh";
        }
    }
}
