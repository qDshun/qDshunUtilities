using Flee.PublicTypes;
using System.Text.RegularExpressions;

namespace qDshunUtilities.Helpers;

public static class DiceExpressionEvaluator
{
    public static int EvaluateDiceExpression(string expression)
    {
        string processedExpression = PreprocessDiceNotation(expression);

        var context = new ExpressionContext();
        context.Imports.AddType(typeof(Math)); // For math functions like ^ (power)
        context.Imports.AddType(typeof(DiceFunctions));

        var expr = context.CompileDynamic(processedExpression);

        return Convert.ToInt32(expr.Evaluate());
    }

    private static string PreprocessDiceNotation(string expression)
    {
        var regex = new Regex(@"\b(\d+)d(\d+)\b");
        return regex.Replace(expression, match => $"RollDice({match.Groups[1].Value};{match.Groups[2].Value})");
    }

    public static class DiceFunctions
    {
        public static int RollDice(int numberOfDice, int numberOfSides)
        {
            var random = new Random();
            int total = 0;
            for (int i = 0; i < numberOfDice; i++)
            {
                total += random.Next(1, numberOfSides + 1);
            }
            return total;
        }
    }
}
