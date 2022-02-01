namespace Wowthing.Backend.Models
{
    public class JobHttpResult<T>
    {
        public T Data { get; set; }
        public bool NotModified { get; set; }
    }
}
