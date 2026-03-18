namespace Wowthing.Tool.Models.Reputations;

public class ManualRenownReward
{
    public short Level { get; set; }
    public List<string> Names { get; set; } = [];
    public List<string> ToastDescriptions { get; set; } = [];

    public ManualRenownReward(short level)
    {
        Level = level;
    }
}
