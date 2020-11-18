using System.Collections.Generic;
using Wowthing.Lib.Models;

namespace Wowthing.Web.ViewModels
{
    public class UserViewModel
    {
        public readonly ApplicationUser User;
        public readonly List<WowCharacter> Characters;

        public UserViewModel(ApplicationUser user, List<WowCharacter> characters)
        {
            User = user;
            Characters = characters;
        }
    }
}