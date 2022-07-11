using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Achievements
{
    [JsonConverter(typeof(OutCriteriaTreeConverter))]
    public class OutCriteriaTree : ICloneable
    {
        public int Amount { get; set; }
        public int CriteriaId { get; set; }
        public int Flags { get; set; }
        public int Id { get; set; }
        public int Operator { get; set; }
        public string Description { get; set; }

        public List<int> Children { get; set; }

        public OutCriteriaTree()
        { }

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

        public object Clone()
        {
            return new OutCriteriaTree
            {
                Amount = Amount,
                CriteriaId = CriteriaId,
                Flags = Flags,
                Id = Id,
                Operator = Operator,
                Description = Description,
                Children = Children,
            };
        }
    }
}
