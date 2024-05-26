using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.EF;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
    : IdentityUserContext<UserEntity, Guid>(options)
{
    public DbSet<LootItemEntity> LootItems { get; set; }
    public DbSet<LootSourceEntity> LootSources { get; set; }
    override public DbSet<UserEntity> Users { get; set; }
    public DbSet<WorldEntity> Worlds { get; set; }
    public DbSet<WorldUserEntity> WorldUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
