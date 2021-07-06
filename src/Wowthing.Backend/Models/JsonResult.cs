namespace Wowthing.Backend.Models
{
    public class JsonResult<T>
    {
        public T Data { get; set; }
        public bool NotModified { get; set; }
    }
}
