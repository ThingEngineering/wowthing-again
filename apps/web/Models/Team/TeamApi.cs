using Wowthing.Lib.Enums;

namespace Wowthing.Web.Models.Team;

public class TeamApi
{
    public int Id { get; set; }
    public WowRegion Region { get; set; }
    public int DefaultRealmId { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public string Description { get; set; }

    // Navigation properties
    public List<TeamApiCharacter> Characters { get; set; }

    public TeamApi(Lib.Models.Team.Team team)
    {
        Id = team.Id;
        Region = team.Region;
        DefaultRealmId = team.DefaultRealmId;
        Name = team.Name;
        Slug = team.Slug;
        Description = team.Description;

        Characters = team.Characters
            .Select(c => new TeamApiCharacter(c))
            .ToList();
    }
}