using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Automapper.Profiles;

public class LootSourceProfile : Profile
{
    public LootSourceProfile()
    {
        CreateMap<LootSourceEntity, MaterializedLootSource>()
            .ForMember(dest => dest.Expression, opt => opt.Ignore())
            .ForMember(dest => dest.Count, opt => opt.Ignore())
            .ForMember(dest => dest.MaterializedLootItems, opt => opt.MapFrom(src => src.LootItems))
            ;

        CreateMap<LootSourceEntity, LootSource>()
            .ForMember(dest => dest.LootItems, opt => opt.MapFrom(src => src.LootItems))
            ;

        CreateMap<LootSourceCreate, LootSourceEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootItems, opt => opt.Ignore())
            .ForMember(dest => dest.WorldId, opt => opt.Ignore())
            .ForMember(dest => dest.World, opt => opt.Ignore())
            ;

        CreateMap<LootSourceUpdate, LootSourceEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootItems, opt => opt.Ignore())
            .ForMember(dest => dest.WorldId, opt => opt.Ignore())
            .ForMember(dest => dest.World, opt => opt.Ignore())
            ;
    }
}
