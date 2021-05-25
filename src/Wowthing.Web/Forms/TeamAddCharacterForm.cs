using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms
{
    public class TeamAddCharacterForm
    {
        [HiddenInput]
        public Guid TeamId { get; set; }

        public int RealmId { get; set; }
        public string CharacterName { get; set; }
        public WowRole PrimaryRole { get; set; }
        public WowRole SecondaryRole { get; set; }

        public TeamAddCharacterForm(Guid guid)
        {
            TeamId = guid;
        }
    }
}
