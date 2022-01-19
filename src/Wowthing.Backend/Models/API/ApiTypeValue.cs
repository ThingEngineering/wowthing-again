namespace Wowthing.Backend.Models.API
{
    public class ApiTypeValue<TType, TValue>
    {
        public TType Type { get; set; }
        public TValue Value { get; set; }
    }
}
