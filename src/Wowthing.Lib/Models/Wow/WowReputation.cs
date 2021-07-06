using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Wow
{
    public class WowReputation
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        
        public string Name { get; set; }
        public int TierId { get; set; }
    }
}
