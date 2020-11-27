using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class WowReputationTier
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        
        public int[] MinValues { get; set; }
        public int[] MaxValues { get; set; }
        public string[] Names { get; set; }
    }
}
