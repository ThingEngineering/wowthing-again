using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Models
{
    public class PlayerAccountToys
    {
        [Key, ForeignKey("Account")]
        public int AccountId { get; set; }
        public PlayerAccount Account { get; set; }

        public List<int> ToyIds { get; set; }
    }
}
