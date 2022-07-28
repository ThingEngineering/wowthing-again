using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models;

public class UserApiAccount
{
    public int Id { get; set; }
    public int Region { get; set; }
    public long AccountId { get; set; }
    public string Tag { get; set; }
    public bool Enabled { get; set; }

    public UserApiAccount(PlayerAccount playerAccount)
    {
        Id = playerAccount.Id;
        AccountId = playerAccount.AccountId;
        Region = (int)playerAccount.Region;
        Tag = playerAccount.Tag;
        Enabled = playerAccount.Enabled;
    }
}
