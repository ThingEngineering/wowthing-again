using System.Collections.Generic;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Web.Forms;

namespace Wowthing.Web.ViewModels
{
    public class TeamViewModel
    {
        public readonly Team Team;
        public readonly string StaticHash;

        public TeamViewModel(Team team, string staticHash)
        {
            Team = team;
            StaticHash = staticHash;
        }

        public TeamAddCharacterForm AddForm => new TeamAddCharacterForm(Team.Guid);
    }
}
