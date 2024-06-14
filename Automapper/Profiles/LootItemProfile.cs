using AutoMapper;
using qDshunUtilities.EF.Entities;
using qDshunUtilities.Helpers;
using qDshunUtilities.Models.Inbound;
using qDshunUtilities.Models.Outbound;

namespace qDshunUtilities.Automapper.Profiles;

public class LootItemProfile : Profile
{
    public LootItemProfile()
    {

        
        CreateMap<LootItemEntity, MaterializedLootItem>()
            .ForMember(dest => dest.Count, opt => opt.MapFrom(src => DiceExpressionEvaluator.EvaluateDiceExpression(src.CountExpression)))
            ;

        CreateMap<LootItemEntity, LootItem>()
            ;

        CreateMap<LootItemCreate, LootItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootSource, opt => opt.Ignore())
            .ForMember(dest => dest.LootSourceId, opt => opt.Ignore())
            ;

        CreateMap<LootItemUpdate, LootItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.LootSource, opt => opt.Ignore())
            .ForMember(dest => dest.LootSourceId, opt => opt.Ignore())
            ;
    }
}
