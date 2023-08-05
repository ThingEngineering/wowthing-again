using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserAccount
{
    public int Id { get; set; }
    public int Region { get; set; }
    public long AccountId { get; set; }
    public string Tag { get; set; }
    public bool Enabled { get; set; }

    public ApiUserAccount(PlayerAccount playerAccount)
    {
        Id = playerAccount.Id;
        AccountId = playerAccount.AccountId;
        Region = (int)playerAccount.Region;
        Tag = playerAccount.Tag;
        Enabled = playerAccount.Enabled;
    }
}
