using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models
{
    public class TeamApiCharacter
    {
        public UserApiCharacter Character { get; set; }
        public string Note { get; set; }
        public WowRole PrimaryRole { get; set; }
        public WowRole SecondaryRole { get; set; }

        public TeamApiCharacter(WowDbContext context, TeamCharacter character)
        {
            Character = new UserApiCharacter(context, character.Character, pub: true);
            Note = character.Note;
            PrimaryRole = character.PrimaryRole;
            SecondaryRole = character.SecondaryRole;
        }
    }
}
