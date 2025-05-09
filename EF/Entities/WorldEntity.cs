﻿using qDshunUtilities.EF.Entities.WorldObjects;

namespace qDshunUtilities.EF.Entities;

public class WorldEntity: BaseEntity
{
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public List<LootSourceEntity> LootSources { get; set; } = [];

    public List<WorldUserEntity> WorldUsers { get; set; } = [];
    public List<WorldObjectEntity> WorldObjects { get; set; } = [];
}
