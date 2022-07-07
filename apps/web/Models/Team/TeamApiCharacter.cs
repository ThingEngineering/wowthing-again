﻿using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Team;

namespace Wowthing.Web.Models.Team
{
    public class TeamApiCharacter
    {
        public UserApiCharacter Character { get; set; }
        public string Note { get; set; }
        public WowRole PrimaryRole { get; set; }
        public WowRole SecondaryRole { get; set; }

        public TeamApiCharacter(TeamCharacter character)
        {
            Character = new UserApiCharacter(
                character.Character,
                Array.Empty<PlayerCharacterItem>(),
                Array.Empty<PlayerCharacterItem>(),
                pub: true
            );
            Note = character.Note;
            PrimaryRole = character.PrimaryRole;
            SecondaryRole = character.SecondaryRole;
        }
    }
}
