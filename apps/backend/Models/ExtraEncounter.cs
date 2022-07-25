namespace Wowthing.Backend.Models;

public class ExtraEncounter
{
    public int? AfterEncounter { get; set; }
    public string Name { get; set; }

    public ExtraEncounter(string name)
    {
        Name = name;
    }
}
