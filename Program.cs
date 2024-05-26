
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using qDshunUtilities.Automapper;
using qDshunUtilities.EF;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Services;
using System;

namespace qDshunUtilities;

public class Program
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
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();

        builder.Services.AddAuthorizationBuilder();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = IdentityConstants.BearerScheme;
            options.DefaultChallengeScheme = IdentityConstants.BearerScheme;
            options.DefaultSignInScheme = IdentityConstants.BearerScheme;
        })
            .AddBearerToken(IdentityConstants.BearerScheme);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddSingleton(serviceProvider => new AutomapperConfiguration(serviceProvider, builder.Environment).GetMapper());

        builder.Services.AddScoped<IWorldService, WorldService>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();


        app.MapControllers();
        app.MapIdentityApi<UserEntity>();
        app.Run();
    }

    private static readonly Action<IdentityOptions> passwordConfiguration = options =>
    {
        options.Password.RequireNonAlphanumeric = false;
    };
}
