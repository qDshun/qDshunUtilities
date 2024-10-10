using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Automapper.Profiles;

public class WorldProfile : Profile
{
    public WorldProfile()
    {
        CreateMap<WorldEntity, World>()
            .ForMember(dest => dest.LootSources, opt => opt.MapFrom(src => src.LootSources))
            ;

        CreateMap<WorldCreate, WorldEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.WorldUsers, opt => opt.Ignore())
            .ForMember(dest => dest.LootSources, opt => opt.Ignore())
            .ForMember(dest => dest.WorldObjects, opt => opt.Ignore())
            ;

        CreateMap<WorldUpdate, WorldEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.WorldUsers, opt => opt.Ignore())
            .ForMember(dest => dest.LootSources, opt => opt.Ignore())
            .ForMember(dest => dest.WorldObjects, opt => opt.Ignore())
            ;
    }
}
