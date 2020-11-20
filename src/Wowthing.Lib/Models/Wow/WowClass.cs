using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class WowClass
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public List<int> SpecializationIds { get; set; } = new List<int>();
    }
}
