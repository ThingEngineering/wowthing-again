using System.Collections.Generic;

namespace Wowthing.Web.Models.Search
{
    public class ItemSearchResponseItem
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public List<ItemSearchResponseCharacter> Characters { get; set; }
    }
}
