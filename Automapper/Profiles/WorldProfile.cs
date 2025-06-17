using AutoMapper;
using qDshunUtilities.Controllers.WorldController.Inbound;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.World;

namespace qDshunUtilities.Automapper.Profiles;

public class WorldProfile : Profile
{
    public WorldProfile()
    {
        CreateMap<WorldEntity, WorldModel>()
            .ForMember(dest => dest.LootSources, opt => opt.MapFrom(src => src.LootSources))
            ;

        CreateMap<WorldCreateRequest, WorldEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.WorldUsers, opt => opt.Ignore())
            .ForMember(dest => dest.LootSources, opt => opt.Ignore())
            .ForMember(dest => dest.WorldObjects, opt => opt.Ignore())
            ;

        CreateMap<WorldUpdateRequest, WorldEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.WorldUsers, opt => opt.Ignore())
            .ForMember(dest => dest.LootSources, opt => opt.Ignore())
            .ForMember(dest => dest.WorldObjects, opt => opt.Ignore())
            ;
    }
}
