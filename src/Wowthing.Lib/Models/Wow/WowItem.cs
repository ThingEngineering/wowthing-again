using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow
{
    public class WowItem
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
