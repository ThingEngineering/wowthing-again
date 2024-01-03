using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

[JsonConverter(typeof(WowRealmConverter))]
public class WowRealm
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }
    public int ConnectedRealmId { get; set; }
    public WowRegion Region { get; set; }
    public string Name { get; set; }
    public string EnglishName { get; set; }
    public string Slug { get; set; }
    public string Locale { get; set; }
}
