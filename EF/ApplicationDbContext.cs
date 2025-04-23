using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.EF.Entities;

namespace qDshunUtilities.EF;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
    : IdentityUserContext<UserEntity, Guid>(options)
{
    public DbSet<ChatMessageEntity> ChatMessages { get; set; }
    public DbSet<LootItemEntity> LootItems { get; set; }
    public DbSet<LootSourceEntity> LootSources { get; set; }
    public DbSet<ObjectFieldEntity> ObjectFields { get; set; }
    public DbSet<PermissionEntity> Permissions { get; set; }
    public DbSet<TemplateEntity> Templates { get; set; }
    override public DbSet<UserEntity> Users { get; set; }
    public DbSet<WorldEntity> Worlds { get; set; }
    public DbSet<WorldObjectEntity> WorldObjects { get; set; }
    public DbSet<WorldObjectPermissionEntity> WorldObjectPermissions { get; set; }
    public DbSet<WorldUserEntity> WorldUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<UserEntity>()
            .HasMany(u => u.WorldUsers)
            .WithOne(u => u.User);

        base.OnModelCreating(builder);
    }
}
