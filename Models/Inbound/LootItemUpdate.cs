﻿namespace qDshunUtilities.Models.Inbound;

public class LootItemUpdate
{
    public string Name { get; set; }
    public string Description { get; set; }
    public double Weight { get; set; }
    public double Cost { get; set; }
    public string CountExpression { get; set; }
}
