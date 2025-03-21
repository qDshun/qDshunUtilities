
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.Automapper;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Services;
using SignalRWebpack.Hubs;


namespace qDshunUtilities;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var connectionString = builder.Configuration["qDshunUtilitiesConnectionString"];
        builder.Services
            .AddDbContext<ApplicationDbContext>(options =>
            {
                var serverVersion = new MariaDbServerVersion(ServerVersion.AutoDetect(connectionString));
                options.UseMySql(connectionString, serverVersion);

                if (builder.Environment.IsDevelopment())
                {
                    options.EnableDetailedErrors(true);
                    options.EnableSensitiveDataLogging(true);
                }

            });

        builder.Services
            .AddIdentityCore<UserEntity>(passwordConfiguration)
            .AddDefaultTokenProviders()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();


        builder.Services.AddAuthorizationBuilder();

        builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
            .AddIdentityCookies();

        builder.Services.ConfigureApplicationCookie(disableRedirectsOnFailedLogin);
        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddSingleton(serviceProvider => new AutomapperConfiguration(serviceProvider, builder.Environment).GetMapper());

        builder.Services.AddScoped<IWorldService, WorldService>();
        builder.Services.AddScoped<IWorldObjectService, WorldObjectService>();
        builder.Services.AddScoped<ILootItemService, LootItemService>();
        builder.Services.AddScoped<ILootSourceService, LootSourceService>();
        builder.Services.AddScoped<IAccessService, AccessService>();
        builder.Services.AddScoped<IObjectFieldService, ObjectFieldService>();
        builder.Services.AddSingleton<IDiceService, DiceService>();


        builder.Services.AddSignalR();
        builder.Services.AddCors();
        var app = builder.Build();

        app.UseDefaultFiles();
        app.UseStaticFiles();
        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            //app.AddEfDiagrams<ApplicationDbContext>();
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors(options =>
            {
                options.SetIsOriginAllowed(_ => true)
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
            });
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapHub<ChatHub>("/hub");

        app.MapControllers();
        app.MapGroup("/api/identity").WithTags("Identity").MapIdentityApi<UserEntity>();
        app.Run();
    }

    private static readonly Action<IdentityOptions> passwordConfiguration = options =>
    {
        options.Password.RequireNonAlphanumeric = false;
    };

    private static readonly Action<CookieAuthenticationOptions> disableRedirectsOnFailedLogin = options =>
    {
        options.Cookie.SameSite = SameSiteMode.None;
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = 401;
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = 403;
                return Task.CompletedTask;
            }
        };
    };
}
