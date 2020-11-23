using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class PlayerCollections
    {
        [Key]
        public long UserId;
        
        public List<int> Mounts { get; set; }
        public List<int> Pets { get; set; }
        public List<int> Toys { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
