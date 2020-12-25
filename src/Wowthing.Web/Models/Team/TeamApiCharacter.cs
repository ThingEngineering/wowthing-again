using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models
{
    public class TeamApiCharacter
    {
        public UserApiCharacter Character { get; set; }

        public TeamApiCharacter(WowDbContext context, TeamCharacter character)
        {
            Character = new UserApiCharacter(context, character.Character, pub: true);
        }
    }
}
