using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models
{
    public class UserApiAccount
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Tag { get; set; }
        public bool Enabled { get; set; }

        public UserApiAccount(PlayerAccount playerAccount)
        {
            Id = playerAccount.Id;
            Name = playerAccount.Name;
            Tag = playerAccount.Tag;
            Enabled = playerAccount.Enabled;
        }
    }
}
