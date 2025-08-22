using AutoMapper;
using qDshunUtilities.Controllers.LootSource.Inbound;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Models.Loot;

namespace qDshunUtilities.Automapper.Profiles;

public class LootSourceProfile : Profile
{
    public LootSourceProfile()
    {
        CreateMap<LootSourceEntity, MaterializedLootSourceModel>()
            .ForMember(dest => dest.Expression, opt => opt.Ignore())
            .ForMember(dest => dest.Count, opt => opt.Ignore())
            .ForMember(dest => dest.MaterializedLootItems, opt => opt.MapFrom(src => src.LootItems))
            ;

        CreateMap<LootSourceEntity, LootSourceModel>()
            .ForMember(dest => dest.LootItems, opt => opt.MapFrom(src => src.LootItems))
            ;

        CreateMap<LootSourceCreateRequest, LootSourceEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootItems, opt => opt.Ignore())
            .ForMember(dest => dest.WorldId, opt => opt.Ignore())
            .ForMember(dest => dest.World, opt => opt.Ignore())
            ;

        CreateMap<LootSourceUpdateRequest, LootSourceEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootItems, opt => opt.Ignore())
            .ForMember(dest => dest.WorldId, opt => opt.Ignore())
            .ForMember(dest => dest.World, opt => opt.Ignore())
            ;
    }
}
