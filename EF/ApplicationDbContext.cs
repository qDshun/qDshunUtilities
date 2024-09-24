using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF.Entities;
using System.Reflection.Emit;

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
        builder.Entity<UserEntity>()
            .HasMany(u => u.WorldUsers)
            .WithOne(u => u.User);

        base.OnModelCreating(builder);
    }
}
