namespace Wowthing.Lib.Models;

public interface IGoldSnapshot
{
    public DateTime Time { get; }

    public int AccountId { get; }
    public int RealmId { get; }
    public int Gold { get; }
}
