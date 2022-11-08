using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Comparers;

public class PlayerCharacterAddonAchievementsAchievementComparer : IEqualityComparer<PlayerCharacterAddonAchievementsAchievement>
{
    public bool Equals(PlayerCharacterAddonAchievementsAchievement x, PlayerCharacterAddonAchievementsAchievement y)
    {
        if (ReferenceEquals(x, y))
        {
            return true;
        }

        if (ReferenceEquals(x, null))
        {
            return false;
        }

        if (ReferenceEquals(y, null))
        {
            return false;
        }

        if (x.GetType() != y.GetType())
        {
            return false;
        }

        return x.Earned == y.Earned && x.Criteria.EmptyIfNull().SequenceEqual(y.Criteria.EmptyIfNull());
    }

    public int GetHashCode(PlayerCharacterAddonAchievementsAchievement obj)
    {
        return HashCode.Combine(obj.Earned, obj.Criteria);
    }
}
