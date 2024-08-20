namespace Wowthing.Tool.Models;

public interface IDataCategoryNested<T> : IDataCategory
{
    public List<T> Children { get; }
}
