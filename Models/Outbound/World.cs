﻿namespace qDshunUtilities.Models.Outbound;

public class World
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public IEnumerable<LootSource> LootSources { get; set; }
}
