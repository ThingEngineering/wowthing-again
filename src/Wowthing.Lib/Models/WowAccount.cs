using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class WowAccount
    {
        [Key]
        public long Id { get; set; }

        public long UserId { get; set; }
        public ApiRegion Region { get; set; }
        public string Name { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
