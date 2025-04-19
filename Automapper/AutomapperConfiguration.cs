using AutoMapper;
using qDshunUtilities.Automapper.Profiles;

namespace qDshunUtilities.Automapper;

public class AutomapperConfiguration
{
    readonly MapperConfiguration _config;

    public AutomapperConfiguration(IServiceProvider seviceProvider, IWebHostEnvironment environment)
    {
        _config = new MapperConfiguration(GetMapperConfiguration(seviceProvider));
        if (environment.IsDevelopment())
        {
            // https://docs.automapper.org/en/stable/Custom-type-converters.html
            //_config.AssertConfigurationIsValid(); // Throw error if any of profiles are configured wrong
        }
    }

    public IMapper GetMapper()
    {
        return _config.CreateMapper();
    }

    private static MapperConfigurationExpression GetMapperConfiguration(IServiceProvider seviceProvider)
    {
        var cfg = new MapperConfigurationExpression
        {
            AllowNullCollections = true
        };

        // Register profiles
        cfg.AddProfile(new WorldProfile());
        cfg.AddProfile(new WorldObjectProfile());
        cfg.AddProfile(new LootSourceProfile());
        cfg.AddProfile(new LootItemProfile());

        return cfg;
    }
}
