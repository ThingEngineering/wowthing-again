using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow
{
    public class WowRealm
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public WowRegion Region { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
    }
}
