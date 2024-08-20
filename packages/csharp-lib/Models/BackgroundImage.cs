using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Wowthing.Lib.Models;

public class BackgroundImage
{
    public int Id { get; set; }

    public short DefaultBrightness { get; set; } = 10;
    public short DefaultSaturate { get; set; } = 10;

    [ForeignKey("Role")]
    [JsonIgnore]
    public long? RoleId { get; set; }

    [JsonIgnore]
    public IdentityRole<long> Role { get; set; }

    public string Filename { get; set; }
    public string Description { get; set; }
    public string Attribution { get; set; }
}
