using System.Runtime.Serialization;

namespace qDshunUtilities.Exceptions;

public class UnautorizedRequestException : Exception
{
    public UnautorizedRequestException()
    {
    }

    public UnautorizedRequestException(string message) : base(message)
    {
    }

    public UnautorizedRequestException(string message, Exception innerException) : base(message, innerException)
    {
    }

    protected UnautorizedRequestException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}
