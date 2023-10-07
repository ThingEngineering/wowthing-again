using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms;

public class ApiAuctionsSpecificForm
{
    public string AppearanceSource { get; set; }
    public int ItemId { get; set; }
    public int PetSpeciesId { get; set; }
    public WowRegion Region { get; set; }
}
