namespace Wowthing.Backend.Models.Data.Transmog
{
    public class OutTransmogCategory
    {
        public string Name { get; set; }
        public List<string> SkipClasses { get; set; }
        public List<OutTransmogGroup> Groups { get; set; }

        public string Slug => Name.Slugify();

        public OutTransmogCategory()
        { }
        
        public OutTransmogCategory(DataTransmogCategory category)
        {
            Name = category.Name;
            SkipClasses = category.SkipClasses.EmptyIfNull();
            Groups = category.Groups
                .EmptyIfNull()
                .Select(group => new OutTransmogGroup(group))
                .ToList();
        }
    }
}
