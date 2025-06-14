namespace Wowthing.Lib.Models;

public class CriteriaCache
{
    public int[] Account { get; set; }
    public int[] Character { get; set; }
}

public class CriteriaCacheSets(CriteriaCache criteriaCache)
{
    public HashSet<int> Account = new(criteriaCache.Account);
    public HashSet<int> Character = new(criteriaCache.Character);
}
