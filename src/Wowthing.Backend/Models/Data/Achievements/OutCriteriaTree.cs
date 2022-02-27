using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Achievements
{
    [JsonConverter(typeof(OutCriteriaTreeConverter))]
    public class OutCriteriaTree
    {
        public int Amount { get; }
        public int CriteriaId { get; }
        public int Flags { get; }
        public int Id { get; }
        public int Operator { get; }
        public string Description { get; }
        
        public List<int> Children { get; }

        public OutCriteriaTree(DumpCriteriaTree criteriaTree)
        {
            Amount = criteriaTree.Amount;
            CriteriaId = criteriaTree.CriteriaID;
            Flags = criteriaTree.Flags;
            Id = criteriaTree.ID;
            Operator = criteriaTree.Operator;
            Description = criteriaTree.Description;
            Children = criteriaTree.Children
                .OrderBy(c => c.OrderIndex)
                .Select(c => c.ID)
                .ToList();
        }
    }
}
