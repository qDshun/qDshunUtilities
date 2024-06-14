using qDshunUtilities.Helpers;

namespace qDshunUtilities.Services;

public interface IDiceService
{
    int EvaluateDiceExpression(string expression);
}

public class DiceService() : IDiceService
{
    public int EvaluateDiceExpression(string expression)
    {
        return DiceExpressionEvaluator.EvaluateDiceExpression(expression);
    }
}
