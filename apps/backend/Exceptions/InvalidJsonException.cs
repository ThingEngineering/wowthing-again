namespace Wowthing.Backend.Exceptions;

public class InvalidJsonException : Exception
{
    public InvalidJsonException()
    {
    }

    public InvalidJsonException(string message)
        : base(message)
    {
    }

    public InvalidJsonException(string message, Exception inner)
        : base(message, inner)
    {
    }
}
