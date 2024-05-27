using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models;

namespace qDshunUtilities.Automapper.Profiles;

public class WorldProfile : Profile
{
    public WorldProfile()
    {
        CreateMap<WorldEntity, World>();

        CreateMap<WorldCreate, WorldEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.WorldUsers, opt => opt.Ignore())
            .ForMember(dest => dest.LootSources, opt => opt.Ignore())
            ;

        CreateMap<WorldUpdate, WorldEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.WorldUsers, opt => opt.Ignore())
            .ForMember(dest => dest.LootSources, opt => opt.Ignore())
            ;
    }
}
